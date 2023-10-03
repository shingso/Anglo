import { isSameDay } from "date-fns"

import { supabase } from "../services/supabase/supabase"
import {
  Flashcard_Fields,
  deleteFlashcard,
  mapReponseToFlashcard,
  upsertMultipleFlashcards,
} from "./flashcardUtils"
import { showErrorToast } from "./errorUtils"
import { shuffle } from "./helperUtls"
import { Deck, DeckSnapshotIn } from "../models/Deck"
import { Flashcard } from "../models/Flashcard"
import { QueryFunctions } from "app/models"
import { v4 as uuidv4 } from "uuid"
export enum Deck_Fields {
  ID = "id",
  TITLE = "title",
  FLASHCARDS = "flashcards",
  LAST_ADDED = "last_added",
  NEW_PER_DAY = "new_per_day",
  GLOBAL_DECK_ID = "global_deck_id",
  LAST_GLOBAL_SYNC = "last_global_sync",
}

export const newPerDayList = [
  { label: "2", value: 2 },
  { label: "3", value: 3 },
  { label: "4", value: 4 },
  { label: "5", value: 5 },
  { label: "6", value: 6 },
  { label: "7", value: 7 },
  { label: "8", value: 8 },
  { label: "9", value: 9 },
  { label: "10", value: 10 },
]

export const getUserDecks = async (): Promise<DeckSnapshotIn[]> => {
  try {
    let { data: decks } = await supabase
      .from("decks")
      .select("*, flashcards:flashcards(*, card_progress:card_progress(*))'")

    return decks.map(mapDeckResponse)
  } catch {
    //TODO HANDLE ERRORS
    showErrorToast("Error", "Could not get decks, please retry login")
  }
  return []
}

export const getDeck = async (id: string) => {
  try {
    let { data: decks, error } = await supabase
      .from("decks")
      .select("*, flashcards:flashcards(*, card_progress:card_progress(*))'")
      .eq("id", id)

    if (decks && decks?.length > 0) {
      return mapDeckResponse(decks[0])
    }
    return null
  } catch {}
  return null
}

const mapDeckResponse = (deck: any): DeckSnapshotIn => {
  return {
    [Deck_Fields.ID]: deck.id,
    [Deck_Fields.TITLE]: deck?.title,
    [Deck_Fields.NEW_PER_DAY]:
      deck?.new_per_day || deck?.new_per_day === 0 ? deck.new_per_day : undefined,
    [Deck_Fields.GLOBAL_DECK_ID]: deck?.global_deck_id ? deck.global_deck_id : undefined,
    [Deck_Fields.FLASHCARDS]: deck?.flashcards
      ? deck.flashcards.map((card) => mapReponseToFlashcard(card))
      : [],
    [Deck_Fields.LAST_ADDED]: deck?.last_added ? new Date(deck.last_added) : undefined,
    [Deck_Fields.LAST_GLOBAL_SYNC]: deck?.last_global_sync
      ? new Date(deck.last_global_sync)
      : undefined,
  }
}

export const addDeck = async (deck: any): Promise<DeckSnapshotIn> => {
  try {
    const { data, error } = await supabase
      .from("decks")
      .insert([
        {
          [Deck_Fields.TITLE]: deck?.title,
          [Deck_Fields.NEW_PER_DAY]: deck?.new_per_day ? deck.new_per_day : 0,
        },
      ])
      .select()
    if (error) {
      showErrorToast("Error", "Deck could not be created.")
      console.log(error, "This is the error")
    }
    if (data && data.length > 0) {
      console.log("this is the added deck", mapDeckResponse(data[0]))
      return mapDeckResponse(data[0])
    }
  } catch (error) {
    showErrorToast("Error", "Deck could not be created.")
  }
  return null
}

export const updateDeck = async (deck: Partial<Deck>) => {
  try {
    const { data, error } = await supabase
      .from("decks")
      .update({ ...deck })
      .eq(Deck_Fields.ID, deck.id)
      .select()
    if (data && data.length > 0) {
      console.log(data)
      return data[0]
    }

    return null
  } catch (error) {
    console.log(error)
    return null
  }
}

export const getRandomFlashcards = (cards: Flashcard[], amount: number): Flashcard[] => {
  if (!cards || !amount) {
    return cards
  }
  return shuffle(cards).slice(0, amount)
}

export const addCardsToShow = async (deck: Deck, amount: number): Promise<DeckSnapshotIn> => {
  if (!deck) {
    return null
  }
  const filteredCards = deck.flashcards.filter((card) => !card?.next_shown)
  const newCardsToShow: Flashcard[] = getRandomFlashcards(filteredCards, amount)
  const startFlashcardResponse = startMultipleFlashcards(newCardsToShow)
  const response = await updateDeckLastAdded(deck)
  return response
}

const startMultipleFlashcards = async (flashcards: Flashcard[]) => {
  const date = new Date()
  const mappedFlashcards = flashcards.map((card) => {
    return { [Flashcard_Fields.NEXT_SHOWN]: date, [Flashcard_Fields.ID]: card.id }
  })
  const flashcardReponse = await upsertMultipleFlashcards(mappedFlashcards)
  //TODO handling flashcard response failed
  flashcards.forEach((card) => card.updateFlashcard({ [Flashcard_Fields.NEXT_SHOWN]: date }))
}

export const updateDeckLastAdded = async (deck: Deck): Promise<DeckSnapshotIn> => {
  const updatedDeck = {
    last_added: new Date(),
    id: deck.id,
  }
  const deckResponse = await updateDeck(updatedDeck)
  deck.updateDeck(deckResponse)
  return deckResponse
}

export const addNewDailyCardsToShow = async (deck: Deck) => {
  if (deck?.last_added && isSameDay(deck.last_added, new Date())) {
    return
  }

  addCardsToShow(deck, deck.new_per_day)
}

export const deleteDeck = async (id: string) => {
  try {
    const { data, error } = await supabase.from("decks").delete().eq(Deck_Fields.ID, id)
  } catch (error) {}
}
