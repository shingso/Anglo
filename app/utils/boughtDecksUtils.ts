import { FlashcardSnapshotIn } from "app/models"
import { supabase } from "../services/supabase/supabase"
import { mapReponseToFlashcard } from "./flashcardUtils"

export interface UserBoughtDecksResponse {
  id: string
  bought_deck_id: string
}

export const getUserBoughtDecks = async (): Promise<UserBoughtDecksResponse[]> => {
  try {
    let { data, error } = await supabase.from("user_bought_deck").select("*")
    console.log(data, error, "userbought")
    if (data) {
      return data
    }
    return null
  } catch (error) {
    console.log(error)
    return null
  }
}

export const importPurchasedCards = async (deckId: string, globalDeckId: string) => {
  try {
    let { data, error } = await supabase.rpc("import_purchased_cards", {
      deck_id: deckId,
      global_deck_id: globalDeckId,
    })
    // we should return the most recent id so that we cna update it it
    // get the decks and update the most recent id
    console.log("we purchased the deck", data, error)
  } catch (error) {
    console.log(error)
  }
}

export const insertFlashcardsAndReturn = async (
  deckId: string,
  globalDeckId: string,
): Promise<FlashcardSnapshotIn[]> => {
  try {
    let { data, error } = await supabase.rpc("insert_flashcards_and_return", {
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
