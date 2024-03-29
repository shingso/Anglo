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
import { Flashcard, FlashcardSnapshotIn } from "../models/Flashcard"
import { v4 as uuidv4 } from "uuid"
import { QueryFunctions } from "app/models/Query"
import { StartOption } from "./consts"

export enum Deck_Fields {
  ID = "id",
  TITLE = "title",
  FLASHCARDS = "flashcards",
  LAST_ADDED = "last_added",
  NEW_PER_DAY = "new_per_day",
  GLOBAL_DECK_ID = "global_deck_id",
  LAST_GLOBAL_SYNC = "last_global_sync",
  PAID_IMPORTED = "paid_imported",
  PICTURE_URL = "picture_url",
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
    [Deck_Fields.PICTURE_URL]: deck?.picture_url ? deck.picture_url : undefined,
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
    [Deck_Fields.PAID_IMPORTED]: deck?.paid_imported,
  }
}

export const addDeck = async (deck: any): Promise<DeckSnapshotIn> => {
  try {
    const { data, error } = await supabase
      .from("decks")
      .insert([
        {
          [Deck_Fields.TITLE]: deck?.title,
          [Deck_Fields.NEW_PER_DAY]: deck?.new_per_day ? deck.new_per_day : 3,
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

export const updateDeck = async (deck: Partial<DeckSnapshotIn>) => {
  try {
    const { data, error } = await supabase
      .from("decks")
      .update({ ...deck })
      .eq(Deck_Fields.ID, deck.id)
      .select()
    if (data && data.length > 0) {
      return data[0]
    }

    return null
  } catch (error) {
    return null
  }
}

export const getRandomFlashcards = (cards: Flashcard[], amount: number): Flashcard[] => {
  if (!cards || !amount) {
    return cards
  }
  return shuffle(cards).slice(0, amount)
}

export const getCardsForDeckOption = (deck: Deck, amount: number): Flashcard[] => {
  const date = new Date()
  const filteredCards = deck.flashcards.filter((card) => !card?.next_shown)

  switch (deck?.startMode) {
    case StartOption.RANDOM:
      return getRandomFlashcards(filteredCards, amount)
    case StartOption.DATE_ADDED:
      return filteredCards
        .sort((a, b) => {
          if (!a?.created_at) {
            return -1
          }
          if (!b?.created_at) {
            return 1
          }

          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        })
        .slice(0, amount)
    default:
      return filteredCards
  }
}

export const addCardsToShow = async (
  deck: Deck,
  amount: number,
  isOffline: boolean,
): Promise<FlashcardSnapshotIn[]> => {
  if (!deck) {
    return null
  }

  const date = new Date()
  const newCardsToShow = getCardsForDeckOption(deck, amount)
  newCardsToShow.forEach((card) => card.updateFlashcard({ [Flashcard_Fields.NEXT_SHOWN]: date }))
  const mappedFlashcards = newCardsToShow.map((card) => {
    return {
      [Flashcard_Fields.NEXT_SHOWN]: date,
      [Flashcard_Fields.ID]: card.id,
      [Flashcard_Fields.DECK_ID]: deck.id,
    }
  })

  if (isOffline) {
    deck.addToQueuedQueries({
      id: uuidv4(),
      variables: JSON.stringify(mappedFlashcards),
      function: QueryFunctions.UPSERT_FLASHCARDS,
    })
    return mappedFlashcards
  }
  const flashcardReponse = await upsertMultipleFlashcards(mappedFlashcards)
  return flashcardReponse
}

/* export const startMultipleFlashcards = async (flashcards: Flashcard[], date: Date) => {
  const mappedFlashcards = flashcards.map((card) => {
    return { [Flashcard_Fields.NEXT_SHOWN]: date, [Flashcard_Fields.ID]: card.id }
  })
  const flashcardReponse = await upsertMultipleFlashcards(mappedFlashcards)
  return flashcardReponse
} */

export const updateDeckLastAdded = async (deck: Deck): Promise<DeckSnapshotIn> => {
  const updatedDeck = {
    last_added: new Date(),
    id: deck.id,
  }
  deck.updateDeck(updatedDeck)
  //TODO fix this
  const deckResponse = await updateDeck(updatedDeck)
  return updatedDeck
}

export const deleteDeck = async (id: string) => {
  try {
    const { data, error } = await supabase.from("decks").delete().eq(Deck_Fields.ID, id)
  } catch (error) {}
}
