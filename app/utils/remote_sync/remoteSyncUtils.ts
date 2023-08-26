import { supabase } from "../../services/supabase/supabase"
import {
  Card_Progress_Fields,
  getCardProgress,
  getCardProgressesByField,
  insertCardProgress,
} from "../cardProgressUtils"
import { updateFlashcard } from "../flashcardUtils"
import { load, save } from "../storage"
import { v4 as uuidv4 } from "uuid"
import { showErrorToast } from "../errorUtils"
import { CardProgress } from "../../models/CardProgress"

export const pendingRemoteFunctionKey = "_pendingRemoteFunctionKey "
export const mostRecentLocalIdKey = "_mostRecentLocalIdKey"
export const confirmedRemoteIdKey = "_confirmedRemoteIdKey"
export enum FunctionTypes {
  INSERT_CARD_PROGRESS = "insert_card_progress",
}

export interface RemoteFunction {
  id: string
  type: FunctionTypes
  data: object
  createdAt: Date
}

export interface RemoteResponse {
  id: string
  last_progress_id: string
}

export interface MostRecentState {
  remoteId: String
  localId: String
}

//if we want to trust local than we should just clear the data and refetch everything
export const returnRemoteAndLocalMostRecent = async (): Promise<MostRecentState> => {
  //should check if the remote state and local state are at the same position
  const remoteMostRecent = await getRemoteRecentUpdate()
  const localMostRecent = await getMostRecentLocalId()
  //last progress id should be updated everytime an insert is inserted
  //remote can also be null if
  //worse case someone somehow deleted the recent update on thier own cache, what should happen?
  return { remoteId: remoteMostRecent?.last_progress_id, localId: localMostRecent }
}

const removeFromRemoteSync = () => {}

export const getRemoteRecentUpdate = async (): Promise<RemoteResponse> => {
  try {
    let { data, error } = await supabase.from("sync").select("*").limit(1)

    if (!!data && data?.length > 0) {
      return data[0]
    }
    return null
  } catch (error) {
    console.log(error)
    return null
  }
}

export const updateMostRecentLocalId = async (id: String): Promise<boolean> => {
  return await save(mostRecentLocalIdKey, id)
}

export const getMostRecentLocalId = async () => {
  //if there is no most recent id then there should be a most recent id in the remote either
  return await load(mostRecentLocalIdKey)
}

export const updateConfirmedRemoteId = async (id: String): Promise<boolean> => {
  return await save(confirmedRemoteIdKey, id)
}

//the Confirmed Remote Key is the last confirmed saved pooint on the phone
export const getConfirmedRemoteId = async () => {
  return await load(confirmedRemoteIdKey)
}

export const getPendingRemoteFunctions = async (): Promise<RemoteFunction[]> => {
  const data = await load(pendingRemoteFunctionKey)
  if (!data) {
    save(pendingRemoteFunctionKey, [])
    return []
  }

  return data
}

export const addFunctionToRemoteSync = (type: FunctionTypes, data: any) => {
  const id = uuidv4()
  //need to find a better way
  const createdAtTimeStamp = new Date()
  data["created_at"] = createdAtTimeStamp
  console.log(data)
  const newRemoteFunction: RemoteFunction = {
    id: id,
    type: type,
    data: data,
    createdAt: createdAtTimeStamp,
  }
  showErrorToast(id, data.toString())
  addToRemoteSync(newRemoteFunction)
}

const removeFunctionFromRemoteSync = async (id: string) => {
  //a function that removes a function from the remote sync by id
  //this would only be needed if we are in offline mode
}

const addToRemoteSync = async (func: RemoteFunction) => {
  const state = await getPendingRemoteFunctions()
  const newState = [...state, func]
  save(pendingRemoteFunctionKey, newState)
}

const replaceRemoteSync = async (funcs: RemoteFunction[]) => {
  save(pendingRemoteFunctionKey, funcs)
}

export const clearRemoteSync = async () => {
  replaceRemoteSync([])
}

//it looks like right now we only handle inserts
const remoteFunctionsMap: { [key: string]: Function } = {
  [FunctionTypes.INSERT_CARD_PROGRESS]: insertCardProgress,
}

export const applyRemoteSync = async (pendingFunctions: RemoteFunction[]) => {
  const sortedPendingRemoteSync = pendingFunctions.sort(
    (a, b) => a.createdAt.getTime() - b.createdAt.getTime(),
  )
  const appliedRemoteSyncs = []
  const remainingRemoteSyncs = []
  /*   const remoteFunction = remoteFunctionsMap[FunctionTypes.INSERT_CARD_PROGRESS]
  const mockCardProgress: CardProgress = {
    flashcard_id: "506e24d2-8722-4091-bbe2-0fbe098c247b",
    time_elapsed: 2000,    
    passed: true,
  }
  const remoteResponse = await remoteFunction(mockCardProgress)
  console.log("remote response", remoteResponse)
 */
  //appliedRemoteSyncs.push(func.id)

  sortedPendingRemoteSync.forEach(async (func: RemoteFunction) => {
    const functionType = func.type
    if (!!remoteFunctionsMap?.[functionType]) {
      const remoteFunction = remoteFunctionsMap[functionType]
      const remoteResponse = await remoteFunction(func.data)
      if (remoteResponse) {
        appliedRemoteSyncs.push(func.id)
      }
    }
    //replaceRemoteSync(remainingRemoteSyncs)
  })
  //remove all of the fuinctions that are applied.
}

const determineConflictResolution = () => {}

export interface ProgressConflicts {
  conflictedProgresses: ConflictedProgresses
  //All of the progress found in one array but not the other
  nonConflictProgresses: CardProgress[]
}

export type ConflictedProgresses = {
  [key: string]: [CardProgress[], CardProgress[]]
}

export const seperateResolutionRequiredConflicts = (
  remoteOperations: CardProgress[],
  localOperations: CardProgress[],
): ProgressConflicts => {
  const resolutionRequiredOperations: ConflictedProgresses = {}

  const nonConflictProgresses: CardProgress[] = []
  remoteOperations.forEach((progress) => {
    if (!localOperations.find((op) => op.flashcard_id === progress.flashcard_id)) {
      nonConflictProgresses.push(progress)
      return
    }
    if (resolutionRequiredOperations?.[progress.flashcard_id]) {
      resolutionRequiredOperations[progress.flashcard_id][0].push(progress)
    } else {
      resolutionRequiredOperations[progress.flashcard_id] = [[progress], []]
    }
  })

  localOperations.forEach((progress) => {
    if (resolutionRequiredOperations?.[progress.flashcard_id]) {
      resolutionRequiredOperations[progress.flashcard_id][1].push(progress)
    } else {
      nonConflictProgresses.push(progress)
    }
  })

  return {
    conflictedProgresses: resolutionRequiredOperations,
    nonConflictProgresses: nonConflictProgresses,
  }
}

function sortProgressByCreatedAt(a: CardProgress, b: CardProgress) {
  // Handling null timestamps
  if (a.created_at === null && b.created_at === null) {
    return 0 // Both timestamps are null, consider them equal
  } else if (a.created_at === null) {
    return 1 // Null timestamps should appear at the bottom
  } else if (b.created_at === null) {
    return -1 // Null timestamps should appear at the bottom
  }
  // Comparing non-null timestamps in descending order
  return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
}

export const autoResolveCardProgresses = (
  conflictedProgress: ConflictedProgresses,
): ProgressConflicts => {
  const autoResolvedConflicts = []
  const manualResolutionConflicts: ConflictedProgresses = {}
  for (const [key, value] of Object.entries(conflictedProgress)) {
    const remoteOperations = value[0].sort((a, b) => sortProgressByCreatedAt(a, b))
    const localOperations = value[1].sort((a, b) => sortProgressByCreatedAt(a, b))
    if (remoteOperations[0].passed === localOperations[0].passed) {
      remoteOperations[0].created_at.getTime() > localOperations[0].created_at.getTime()
        ? autoResolvedConflicts.push(...remoteOperations)
        : autoResolvedConflicts.push(...localOperations)
    } else {
      manualResolutionConflicts[key] = value
    }
  }
  return {
    conflictedProgresses: manualResolutionConflicts,
    nonConflictProgresses: autoResolvedConflicts,
  }
}

export const returnRemoteAndLocalConflicts = async (): Promise<ProgressConflicts> => {
  const confirmedRemoteId = await getConfirmedRemoteId()
  const saveRemoteFunctions = await getPendingRemoteFunctions()
  const nonConflictedCardProgresses: CardProgress[] = []
  const mostRecentRemoteProgress = await getCardProgress(confirmedRemoteId)
  const remoteOperations: any[] = await getCardProgressesByField(
    Card_Progress_Fields.CREATED_AT,
    mostRecentRemoteProgress.created_at,
  )

  const localOperations: CardProgress[] = saveRemoteFunctions
    .filter((func) => func.type === FunctionTypes.INSERT_CARD_PROGRESS)
    .map((func) => func.data as CardProgress)

  const { conflictedProgresses, nonConflictProgresses } = seperateResolutionRequiredConflicts(
    remoteOperations,
    localOperations,
  )
  const autoResolvedResolutions = autoResolveCardProgresses(conflictedProgresses)

  nonConflictedCardProgresses.push(
    ...autoResolvedResolutions.nonConflictProgresses,
    ...nonConflictProgresses,
  )
  return {
    conflictedProgresses: autoResolvedResolutions.conflictedProgresses,
    nonConflictProgresses: nonConflictedCardProgresses,
  }
}

export const applyConflictResolution = async (mostRecentId: string, progresses: CardProgress[]) => {
  try {
    let { data, error } = await supabase.rpc("sync_conflicted_progress", {
      recent_progress_id: mostRecentId,
      payload: progresses,
    })
    // we should return the most recent id so that we cna update it it
    // get the decks and update the most recent id
    console.log("we applied the resolution", data, error)
  } catch (error) {
    console.log(error)
  }
}

const syncLocalMostRecentWithRemote = () => {
  updateConfirmedRemoteId("test")
  //clear all of the pending functions
}
