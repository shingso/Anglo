import { GlobalFlashcardSnapshotIn } from "../models/GlobalFlashcard"
import { supabase } from "../services/supabase/supabase"

export interface GlobalFlashcard {
  [Global_Flashcard_Fields.ID]?: string
  [Global_Flashcard_Fields.FRONT]?: string
  [Global_Flashcard_Fields.BACK]?: string
  [Global_Flashcard_Fields.EXTRA]?: string
  [Global_Flashcard_Fields.EXTRA_ARRAY]?: string[]
  [Global_Flashcard_Fields.SUB_HEADER]?: string
  [Global_Flashcard_Fields.PICTURE_URL]?: string
  [Global_Flashcard_Fields.TYPE]?: string
  [Global_Flashcard_Fields.DIFFICULTIY]?: number
  [Global_Flashcard_Fields.FREQUENCY]?: number
  [Global_Flashcard_Fields.SYLLABLES]?: number
  [Global_Flashcard_Fields.LAST_UPDATED]?: Date
  [Global_Flashcard_Fields.CREATED_AT]?: Date
  [Global_Flashcard_Fields.DECK_ID]?: string
}

export enum Global_Flashcard_Fields {
  ID = "id",
  BACK = "back",
  FRONT = "front",
  EXTRA = "extra",
  EXTRA_ARRAY = "extra_array",
  PICTURE_URL = "picture_url",
  SUB_HEADER = "sub_header",
  TYPE = "type",
  DIFFICULTIY = "difficulty",
  FREQUENCY = "frequency",
  SYLLABLES = "syllables",
  LAST_UPDATED = "last_updated",
  CREATED_AT = "created_at",
  DECK_ID = "deck_id",
}

export const mapReponseToGlobalFlashcard = (globalFlashcard: GlobalFlashcardSnapshotIn) => {
  return {
    [Global_Flashcard_Fields.ID]: globalFlashcard.id,
    [Global_Flashcard_Fields.BACK]: globalFlashcard?.back ? globalFlashcard.back : undefined,
    [Global_Flashcard_Fields.FRONT]: globalFlashcard?.front ? globalFlashcard.front : undefined,
    [Global_Flashcard_Fields.EXTRA]: globalFlashcard?.extra ? globalFlashcard.extra : undefined,
    [Global_Flashcard_Fields.EXTRA_ARRAY]: globalFlashcard?.extra_array
      ? globalFlashcard.extra_array
      : undefined,
    [Global_Flashcard_Fields.PICTURE_URL]: globalFlashcard?.picture_url
      ? globalFlashcard.picture_url
      : undefined,
    [Global_Flashcard_Fields.SUB_HEADER]: globalFlashcard?.sub_header
      ? globalFlashcard.sub_header
      : undefined,
    [Global_Flashcard_Fields.TYPE]: globalFlashcard?.type ? globalFlashcard.type : undefined,
    [Global_Flashcard_Fields.DIFFICULTIY]: globalFlashcard?.difficulty
      ? globalFlashcard.difficulty
      : undefined,
    [Global_Flashcard_Fields.FREQUENCY]: globalFlashcard?.frequency
      ? globalFlashcard.frequency
      : undefined,
    [Global_Flashcard_Fields.LAST_UPDATED]: globalFlashcard?.last_updated
      ? new Date(globalFlashcard.last_updated)
      : undefined,
    [Global_Flashcard_Fields.CREATED_AT]: globalFlashcard?.created_at
      ? new Date(globalFlashcard.created_at)
      : undefined,
  }
}

export const searchGlobalFlashcards = async (searchTerm: string) => {
  let { data: global_flashcards, error } = await supabase
    .from("global_flashcards")
    .select("*")
    .eq("front", searchTerm)
    .limit(2)

  return global_flashcards
}

//map to global flashcard from dictionary defintition

export const addGlobalFlashcard = async (flashcard: GlobalFlashcard) => {
  try {
    const { data, error } = await supabase.from("global_flashcards").insert([
      {
        [Global_Flashcard_Fields.FRONT]: flashcard.front,
        [Global_Flashcard_Fields.BACK]: flashcard.back,
        [Global_Flashcard_Fields.EXTRA]: flashcard.extra,
        [Global_Flashcard_Fields.EXTRA_ARRAY]: flashcard.extra_array,
        [Global_Flashcard_Fields.SUB_HEADER]: flashcard.sub_header,
        [Global_Flashcard_Fields.TYPE]: flashcard.type,
        [Global_Flashcard_Fields.DIFFICULTIY]: flashcard?.difficulty,
      },
    ])
  } catch (error) {
    console.log(error)
  }
}

export const updateGlobalFlashcard = async (flashcard: GlobalFlashcard) => {
  try {
    const { data, error } = await supabase
      .from("global_flashcards")
      .update([flashcard])
      .eq("front", flashcard.front)
  } catch (error) {
    console.log(error)
  }
}

export const addToGlobalDeck = async (flashcard: GlobalFlashcard) => {
  try {
    const { data, error } = await supabase.from("private_global_flashcards").insert([
      {
        [Global_Flashcard_Fields.FRONT]: flashcard.front,
        [Global_Flashcard_Fields.BACK]: flashcard.back,
        [Global_Flashcard_Fields.EXTRA]: flashcard.extra,
        [Global_Flashcard_Fields.EXTRA_ARRAY]: flashcard.extra_array,
        [Global_Flashcard_Fields.SUB_HEADER]: flashcard.sub_header,
        [Global_Flashcard_Fields.TYPE]: flashcard.type,
        [Global_Flashcard_Fields.DIFFICULTIY]: flashcard?.difficulty,
        [Global_Flashcard_Fields.PICTURE_URL]: flashcard?.picture_url,
        [Global_Flashcard_Fields.DECK_ID]: flashcard?.deck_id,
      },
    ])
  } catch (error) {
    console.log(error)
  }
}
