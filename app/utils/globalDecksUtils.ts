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

export const getGlobalDecks = async () => {
  let { data: global_decks, error } = await supabase.from("global_decks").select("*")
  return global_decks
}

export const getGlobalDeckByOriginalId = async (deck_id: string) => {
  let { data: deck, error } = await supabase
    .from("global_decks")
    .select("*, global_flashcards(*)")
    .eq(Global_Deck_Fields.ORIGINAL_ID, deck_id)

  if (deck && deck?.length > 0) {
    console.log(deck[0])
    return deck[0]
  }
  return null
}

export const getGlobalDeckById = async (deck_id: string) => {
  let { data: deck, error } = await supabase
    .from("global_decks")
    .select("*, global_flashcards(*)")
    .eq(Global_Deck_Fields.ID, deck_id)

  if (deck && deck?.length > 0) {
    return deck[0]
  }
  return null
}

export const getGlobalPaidFlashcardsByDeckId = async (deck_id: string) => {
  let { data, error } = await supabase
    .from("global_decks")
    .select("global_flashcards(*)", { count: "exact" })
    .eq(Global_Deck_Fields.ID, deck_id)
  console.log(data, error)
  if (data && data?.length > 0) {
    return data[0]
  }
  return null
}

export const searchGlobalDecks = async (searchTerm: string) => {
  const search: string = "%" + searchTerm + "%"
  let { data, error } = await supabase
    .from("global_decks")
    .select("*, private_global_flashcards(*)")

  return data
}

export const makeDeckPublic = async (deckId: string) => {
  let { data: deck, error } = await supabase.rpc("make_deck_public", {
    deck_id: deckId,
  })
  console.log(deck, error)
  if (error) {
    return null
  }
  return deck
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
    .select("global_flashcards(*)")
    .eq("id", deck_id)
    .gt(field, formattedTime)
  if (deck && deck?.length > 0) {
    console.log(deck[0].global_flashcards)
    return deck[0].global_flashcards
  }
  return []
}

export const importGlobalDeckById = async (deckId: String, deckTitle: String) => {
  let { data: deck, error } = await supabase.rpc("import_global_deck", {
    deck_id: deckId,
    deck_title: deckTitle,
  })
  /* if (deck?.id) {
    const res = await addNewRemoteDeckToStore(deck.id)
    const localDeck = deckStore.getDeckById(deck.id)
    addCardsToShow(localDeck, startingValue)
  } */
}
