import { CardProgressModel, CardProgressSnapshotIn } from "../models/CardProgress"
import { supabase } from "../services/supabase/supabase"
import { showErrorToast } from "./errorUtils"
import {
  FunctionTypes,
  addFunctionToRemoteSync,
  updateConfirmedRemoteId,
} from "./remote_sync/remoteSyncUtils"
import { format } from "date-fns"

export enum Card_Progress_Fields {
  ID = "id",
  FLASHCARD_ID = "flashcard_id",
  TIME_ELAPSED = "time_elapsed",
  CREATED_AT = "created_at",
  RETRIEVAL_LEVEL = "retrieval_level",
}

export interface CardProgress {
  [Card_Progress_Fields.ID]?: string
  [Card_Progress_Fields.FLASHCARD_ID]?: string
  [Card_Progress_Fields.TIME_ELAPSED]?: number
  [Card_Progress_Fields.CREATED_AT]?: Date
  [Card_Progress_Fields.RETRIEVAL_LEVEL]?: number
}

export const CardProgressOutputFields = `id, flashcard_id, time_elapsed, created_at, retrieval_level`

export const getCardProgress = async (id: String): Promise<CardProgress> => {
  try {
    let { data: card_progress, error } = await supabase
      .from("user_progress")
      .select(CardProgressOutputFields)
      .eq("id", id)
      .limit(1)
    if (!!card_progress && card_progress?.length > 0) {
      return card_progress[0]
    }
    return null
  } catch (error) {
    console.log(error)
    return null
  }
}

export const mapResponseToCardProgress = (progress: any): CardProgressSnapshotIn => {
  return {
    [Card_Progress_Fields.ID]: progress?.id ? progress?.id : undefined,
    [Card_Progress_Fields.FLASHCARD_ID]: progress?.flashcard_id
      ? progress?.flashcard_id
      : undefined,
    [Card_Progress_Fields.RETRIEVAL_LEVEL]:
      progress?.retrieval_level || progress?.retrieval_level === 0
        ? progress?.retrieval_level
        : undefined,
    [Card_Progress_Fields.CREATED_AT]: progress?.created_at
      ? new Date(progress.created_at)
      : undefined,
    [Card_Progress_Fields.TIME_ELAPSED]:
      progress?.time_elapsed || progress?.time_elapsed === 0 ? progress.time_elapsed : undefined,
  }
}

export const getCardProgressesByField = async (id: string, value: any): Promise<CardProgress[]> => {
  try {
    let { data: card_progress, error } = await supabase
      .from("user_progress")
      .select("*")
      .gt(id, value)

    if (!!card_progress && card_progress?.length > 0) {
      return card_progress
    }
    return null
  } catch (error) {
    console.log(error)
    return null
  }
}
export const getMostRecentCardProgress = async (): Promise<CardProgress> => {
  try {
    let { data: card_progress, error } = await supabase
      .from("user_progress")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(1)
    if (!!card_progress && card_progress?.length > 0) {
      return card_progress[0]
    }
    return null
  } catch (error) {
    console.log(error)
    return null
  }
}

export const updateProgressUpdate = async (progress: CardProgress) => {
  const { data, error } = await supabase.functions.invoke("progressUpdate", {
    body: JSON.stringify({ progress: progress }),
  })
  console.log(data, error)
}

export const insertCardProgress = async (
  progress: CardProgressSnapshotIn,
): Promise<CardProgress> => {
  try {
    const { data, error, status, statusText } = await supabase
      .from("card_progress")
      .insert([progress])
      .select()
    if (error) {
      addFunctionToRemoteSync(FunctionTypes.INSERT_CARD_PROGRESS, progress)
      //showErrorToast(status.toString(), statusText)
    }
    if (data && data.length > 0) {
      const response = data[0]
      updateConfirmedRemoteId(response.id)
      return response
    }
  } catch (error) {
    addFunctionToRemoteSync(FunctionTypes.INSERT_CARD_PROGRESS, progress)
    console.log(error, "Failed to add to remote, adding to local remote sync")
  }
  return null
}

export const deleteCardProgress = async (cardProgress: CardProgress): Promise<boolean> => {
  try {
    const { status, error } = await supabase
      .from("card_progress")
      .delete()
      .eq("id", cardProgress.id)
    console.log(status, error)
    if (status === 204) {
      return true
    }
    if (error) {
      showErrorToast(error.message)
    }
    return false
  } catch (error) {
    console.log(error)
    return false
  }
}

export interface DividedCardProgress {
  [key: string]: CardProgressSnapshotIn[]
}

export const divideCardProgressByNextShown = (cardProgresses: CardProgressSnapshotIn[]) => {
  const dividedProgresses: DividedCardProgress = {}

  cardProgresses.forEach((progress) => {
    const formattedDate = format(progress?.created_at, "yyyy-mm-dd")
    if (dividedProgresses?.[formattedDate]) {
      dividedProgresses[formattedDate].push(cardProgresses)
    } else {
      dividedProgresses[formattedDate] = [cardProgresses]
    }
  })
}
