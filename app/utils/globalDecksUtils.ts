import { supabase } from "../services/supabase/supabase"
import { Global_Flashcard_Fields } from "./globalFlashcardsUtils"

export enum Global_Deck_Fields {
  ID = "id",
  DESCRIPTION = "description",
  TITLE = "title",
  FLASHCARDS = "flashcards",
  ORIGINAL_ID = "original_id",
  OWNER_ID = "owner_id",
  LAST_UPDATED = "last_updated",
}

export interface GlobalDeck {
  [Global_Deck_Fields.ID]?: string
  [Global_Deck_Fields.DESCRIPTION]?: string
  [Global_Deck_Fields.TITLE]: string
  [Global_Deck_Fields.FLASHCARDS]: any[]
  [Global_Deck_Fields.ORIGINAL_ID]?: string
  [Global_Deck_Fields.OWNER_ID]?: string
  [Global_Deck_Fields.LAST_UPDATED]?: Date
}

export const getGlobalDeckById = async (deck_id: string) => {
  let { data: deck, error } = await supabase
    .from("global_decks")
    .select("*, private_global_flashcards(*)")
    .eq(Global_Deck_Fields.ID, deck_id)
  if (deck && deck?.length > 0) {
    return deck[0]
  }
  return null
}

export const searchGlobalDecks = async (searchTerm: string) => {
  const search: string = "%" + searchTerm + "%"
  let { data, error } = await supabase
    .from("global_decks")
    .select("*, private_global_flashcards(*)")
    .ilike("title", search)
    .limit(10)
  if (data && data?.length > 0) {
    return data
  }
  return []
}

export const getGlobalDeckFlashcardsAfterTime = async (
  deck_id: string,
  field: Global_Flashcard_Fields,
  time: Date,
) => {
  const date = new Date(time)
  const formattedTime = date.toISOString()
  console.log(field, formattedTime, "current field time")
  let { data: deck, error } = await supabase
    .from("global_decks")
    .select("private_global_flashcards(*)")
    .eq("id", deck_id)
    .gt(field, formattedTime)
  if (deck && deck?.length > 0) {
    console.log(deck[0].private_global_flashcards)
    return deck[0].private_global_flashcards
  }
  return []
}

export const importGlobalDeckById = async (
  deckId: String,
  deckTitle: String,
  newPerDay: Number = 3,
) => {
  let { data: deck, error } = await supabase.rpc("import_global_deck", {
    deck_id: deckId,
    deck_title: deckTitle,
    new_per_day: newPerDay,
  })
  console.log(deck, error)
  return deck
}
