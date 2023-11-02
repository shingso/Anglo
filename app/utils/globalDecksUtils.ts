import { Deck, DeckSnapshotIn, FlashcardSnapshotIn } from "app/models"
import { supabase } from "../services/supabase/supabase"
import { updateDeck } from "./deckUtils"
import { Global_Flashcard_Fields } from "./globalFlashcardsUtils"
import { mapReponseToFlashcard } from "./flashcardUtils"

export enum Global_Deck_Fields {
  ID = "id",
  DESCRIPTION = "description",
  TITLE = "title",
  FLASHCARDS = "flashcards",
  ORIGINAL_ID = "original_id",
  OWNER_ID = "owner_id",
  LAST_UPDATED = "last_updated",
  ICON = "icon",
}

export interface GlobalDeck {
  [Global_Deck_Fields.ID]?: string
  [Global_Deck_Fields.DESCRIPTION]?: string
  [Global_Deck_Fields.TITLE]: string
  [Global_Deck_Fields.FLASHCARDS]: any[]
  [Global_Deck_Fields.ORIGINAL_ID]?: string
  [Global_Deck_Fields.OWNER_ID]?: string
  [Global_Deck_Fields.LAST_UPDATED]?: Date
  [Global_Deck_Fields.ICON]?: string
}

export const getGlobalDeckById = async (deck_id: string) => {
  let { data: deck, error } = await supabase
    .from("global_decks")
    .select("*, private_global_flashcards(*)")
    .eq("private_global_flashcards.free", true)
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
    .eq("private_global_flashcards.free", true)
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

export const importFreeGlobalDeckById = async (
  deckId: String,
  deckTitle: String,
  newPerDay: Number = 3,
) => {
  let { data: deck, error } = await supabase.rpc("import_free_global_deck", {
    deck_id: deckId,
    deck_title: deckTitle,
    new_per_day: newPerDay,
  })
  console.log(deck, error)
  return deck
}

export const importPaidGlobalCards = async (globalDeckId: string, deck: Deck) => {
  const addedFlashcards = await insertPaidFlashcardsIntoDeck(deck.id, globalDeckId)
  //maybe we should possibly add it on the backend
  if (addedFlashcards && addedFlashcards?.length > 0) {
    //this is not an offline mode thing so it shouldnt ever need to update -> we should just update on the BE if it has added the cards
    deck.addMutlipleFlashcards(addedFlashcards)
    const updatedDeck: DeckSnapshotIn = {
      id: deck.id,
      paid_imported: true,
    }
    const res = await updateDeck(updatedDeck)
    deck.updatePaidImport(true)
  }
}

export const insertPaidFlashcardsIntoDeck = async (
  deckId: string,
  globalDeckId: string,
): Promise<FlashcardSnapshotIn[]> => {
  try {
    let { data, error } = await supabase.rpc("import_paid_deck_flashcards", {
      deck_id_param: deckId,
      selected_deck_id: globalDeckId,
    })
    console.log("we purchased the deck", data, error)
    if (data) {
      return data.map((card) => mapReponseToFlashcard(card))
    }
    return null
  } catch (error) {
    console.log(error)
    return null
  }
}
