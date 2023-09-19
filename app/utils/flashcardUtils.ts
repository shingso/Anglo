import { Instance } from "mobx-state-tree"
import { CardProgressArray, CardProgressSnapshotIn } from "../models/CardProgress"
import { Flashcard, FlashcardSnapshotIn } from "../models/Flashcard"
import { supabase } from "../services/supabase/supabase"
import "react-native-get-random-values"
import { v4 as uuidv4 } from "uuid"
import { showErrorToast } from "./errorUtils"
import {
  Card_Progress_Fields,
  insertCardProgress,
  mapResponseToCardProgress,
  updateProgressUpdate,
} from "./cardProgressUtils"
import { GlobalFlashcard } from "./globalFlashcardsUtils"
import { updateConfirmedRemoteId, updateMostRecentLocalId } from "./remote_sync/remoteSyncUtils"
import { calculateCurrentRepetition, calculateEasinessFactor } from "./superMemoUtils"

export enum Flashcard_Fields {
  ID = "id",
  FRONT = "front",
  BACK = "back",
  NEXT_SHOWN = "next_shown",
  DECK_ID = "deck_id",
  CARD_PROGRESS = "card_progress",
  NOTES = "notes",
  PICTURE_URL = "picture_url",
  EXTRA = "extra",
  EXTRA_ARRAY = "extra_array",
  GLOBAL_FLASHCARD_ID = "global_flashcard_id",
  SUB_HEADER = "sub_header",
  CREATED_AT = "created_at",
  TYPE = "type",
  DIFFICULTIY = "difficulty",
}

export const mapReponseToFlashcard = (flashcard: FlashcardSnapshotIn): FlashcardSnapshotIn => {
  return {
    [Flashcard_Fields.ID]: flashcard?.id,
    [Flashcard_Fields.FRONT]: flashcard?.front ? flashcard?.front : undefined,
    [Flashcard_Fields.BACK]: flashcard?.back ? flashcard?.back : undefined,
    [Flashcard_Fields.SUB_HEADER]: flashcard?.sub_header ? flashcard?.sub_header : undefined,
    [Flashcard_Fields.EXTRA]: flashcard?.extra ? flashcard?.extra : undefined,
    [Flashcard_Fields.DECK_ID]: flashcard?.deck_id ? flashcard?.deck_id : undefined,
    [Flashcard_Fields.EXTRA_ARRAY]: flashcard?.extra_array ? flashcard?.extra_array : undefined,
    [Flashcard_Fields.NEXT_SHOWN]: flashcard?.next_shown
      ? new Date(flashcard.next_shown)
      : undefined,
    [Flashcard_Fields.CARD_PROGRESS]: flashcard?.card_progress
      ? (flashcard.card_progress.map((card) => mapResponseToCardProgress(card)) as Instance<
          typeof CardProgressArray
        >)
      : undefined,
    [Flashcard_Fields.PICTURE_URL]: flashcard?.picture_url ? flashcard.picture_url : undefined,
    [Flashcard_Fields.GLOBAL_FLASHCARD_ID]: flashcard?.global_flashcard_id
      ? flashcard.global_flashcard_id
      : undefined,
    [Flashcard_Fields.CREATED_AT]: flashcard?.created_at
      ? new Date(flashcard.created_at)
      : undefined,
    [Flashcard_Fields.DIFFICULTIY]: flashcard?.difficulty ? flashcard.difficulty : undefined,
    [Flashcard_Fields.TYPE]: flashcard?.type ? flashcard.type : undefined,
  }
}

export const addFlashcard = async (flashcard: any): Promise<FlashcardSnapshotIn> => {
  if (!flashcard?.deck_id || !flashcard?.front || !flashcard?.back) {
    //throw some kinda of an ERROR
    console.log("you messed up here which means something is wrong with the data/flow")
  }

  try {
    const { data, error } = await supabase
      .from("flashcards")
      .insert([
        {
          [Flashcard_Fields.DECK_ID]: flashcard.deck_id,
          [Flashcard_Fields.FRONT]: flashcard.front,
          [Flashcard_Fields.BACK]: flashcard?.back,
          [Flashcard_Fields.EXTRA]: flashcard?.extra,
          [Flashcard_Fields.EXTRA_ARRAY]: flashcard?.extra_array ? flashcard.extra_array : [],
          [Flashcard_Fields.SUB_HEADER]: flashcard?.sub_header,
          [Flashcard_Fields.TYPE]: flashcard?.type,
          [Flashcard_Fields.DIFFICULTIY]: flashcard?.difficulty,
          [Flashcard_Fields.PICTURE_URL]: flashcard.picture_url,
          [Flashcard_Fields.ID]: flashcard?.id,
        },
      ])
      .select()
    console.log("we are logging the response to this", data, error)
    if (data && data.length > 0) {
      return mapReponseToFlashcard(data[0])
    }
    return null
  } catch (error) {
    return null
  }
}

//Update

export const updateFlashcard = async (flashcard: Partial<FlashcardSnapshotIn>) => {
  console.log("ran")
  if (!flashcard || !flashcard?.id) {
    return null
  }
  try {
    const { data, error } = await supabase
      .from("flashcards")
      .update({ ...flashcard })
      .eq("id", flashcard.id)
      .select()
    if (error) {
      showErrorToast(error.message)
    }
    if (data && data.length > 0) {
      console.log("data", data)
      return mapReponseToFlashcard(data[0])
    }
    return null
  } catch (error) {
    return null
  }
}

export const updateFlashcardByGlobalFlashcard = async (
  global_flashcard: GlobalFlashcard,
): Promise<FlashcardSnapshotIn> => {
  try {
    const { data, error } = await supabase
      .from("flashcards")
      .update({ ...global_flashcard })
      .eq(Flashcard_Fields.GLOBAL_FLASHCARD_ID, global_flashcard.id)
      .select()
    if (error) {
      showErrorToast(error.message)
      return null
    }
    if (data && data.length > 0) {
      return mapReponseToFlashcard(data[0])
    }
    return null
  } catch (error) {
    return null
  }
}

export const upsertMultipleFlashcards = async (flashcards: any[]) => {
  const mappedFlashcards = flashcards.map((card) => {
    const flashcard: FlashcardSnapshotIn = {
      [Flashcard_Fields.ID]: card?.id,
      [Flashcard_Fields.DECK_ID]: card?.deck_id,
      [Flashcard_Fields.FRONT]: card?.front,
      [Flashcard_Fields.BACK]: card?.back,
      [Flashcard_Fields.SUB_HEADER]: card?.sub_header,
      [Flashcard_Fields.EXTRA]: card?.extra,
      [Flashcard_Fields.EXTRA_ARRAY]: card?.extra_array,
      [Flashcard_Fields.NEXT_SHOWN]: card?.next_shown,
    }
    Object.keys(flashcard).forEach((key) => flashcard[key] === undefined && delete flashcard[key])
    return flashcard
  })
  try {
    const { data, error } = await supabase
      .from("flashcards")
      .upsert([...mappedFlashcards])
      .select()
    return data.map((card) => mapReponseToFlashcard(card))
  } catch (error) {
    return null
  }
}

export const deleteFlashcard = async (flashcard: Flashcard): Promise<boolean> => {
  try {
    const { status, error } = await supabase.from("flashcards").delete().eq("id", flashcard.id)
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

export const insertNote = async (id: string, new_element: string) => {
  let { data, error } = await supabase.rpc("append_array", {
    id,
    new_element,
  })
  console.log(data, error, "insert note")
  return data
}

export const removeNote = async (id: string, new_element: string) => {
  let { data, error } = await supabase.rpc("remove_array", {
    id,
    new_element,
  })
  console.log(data, error, "remove note")
  return data
}

export const uploadPictureFile = async (picture: any): Promise<string> => {
  const pictureFile = picture
  const pictureUrl = uuidv4()
  const url = `public/${pictureUrl}.jpg`
  try {
    const { data, error } = await supabase.storage
      .from("flashcard-pictures")
      .upload(url, pictureFile, {
        cacheControl: "3600",
        upsert: false,
      })
    return pictureUrl
  } catch (error) {
    return null
  }
  //but we would also need to update the picture url in the database if it already exists...or if it doesnt exist, then we just update the store/whatever we ened to update there
}

export const createFormData = (uri: any) => {
  const fileName = uri.split("/").pop()
  const fileType = fileName.split(".").pop()
  const formData = new FormData()
  formData.append("file", {
    uri,
    name: fileName,
    type: `image/${fileType}`,
  } as any)

  return formData
}

export const addToFlashcardProgress = async (
  flashcard: Flashcard,
  retrievalLevel: number,
  levelAttempted: number,
  timeElapsed: number,
): Promise<any> => {
  const newProgress: CardProgressSnapshotIn = {
    [Card_Progress_Fields.MEM_LEVEL]: levelAttempted,
    [Card_Progress_Fields.TIME_ELAPSED]: timeElapsed,
    [Card_Progress_Fields.FLASHCARD_ID]: flashcard.id,
    [Card_Progress_Fields.RETRIEVAL_LEVEL]: retrievalLevel,
  }

  const insertedProgress = await insertCardProgress(newProgress)
  if (insertedProgress) {
    updateMostRecentLocalId(insertedProgress.id)
    //updateConfirmedRemoteId(insertedProgress.id) TODO figure if this is needed
    //updateProgressUpdate(insertedProgress) this is to update the memory levels which is undeed
    flashcard.addToCardProgress(mapResponseToCardProgress(insertedProgress) as any)
  }

  return insertedProgress || newProgress
}

export const calculateFlashcardProgress = (flashcard: Flashcard) => {
  const flashcardStatistics = {
    total: 0,
    correctSwipes: 0,
    middleSwipe: 0,
    failedSwipe: 0,
    timeElapsed: 0,
    currentRepetition: 0,
    easinessFactor: 0,
  }

  if (flashcard?.card_progress && flashcard?.card_progress.length > 0) {
    flashcard?.card_progress.forEach((progress) => {
      console.log("progress", progress)
    })
    flashcardStatistics.currentRepetition = calculateCurrentRepetition(flashcard.card_progress)
    flashcardStatistics.easinessFactor = calculateEasinessFactor(flashcard.card_progress)
    flashcard.card_progress.forEach((progress) => {
      flashcardStatistics.total += 1
      if (progress.retrieval_level === 2) {
        flashcardStatistics.correctSwipes += 1
      }

      if (progress.retrieval_level === 1) {
        flashcardStatistics.middleSwipe += 1
      }

      if (progress.retrieval_level === 0) {
        flashcardStatistics.failedSwipe += 1
      }

      flashcardStatistics.timeElapsed = Math.max(
        flashcardStatistics.timeElapsed,
        progress.time_elapsed,
      )
    })
  }
  return flashcardStatistics
}
