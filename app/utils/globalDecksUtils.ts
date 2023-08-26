import {
  CardProgressArray,
  GlobalDeckSnapshotIn,
  PrivateGlobalFlashcardsSnapshotIn,
} from "app/models"
import { supabase } from "../services/supabase/supabase"
import { Global_Flashcard_Fields } from "./globalFlashcardsUtils"

import { parseISO } from "date-fns"
import { Deck_Fields } from "./deckUtils"
import { Instance } from "mobx-state-tree"
import { mapResponseToCardProgress } from "./cardProgressUtils"
import { Flashcard_Fields } from "./flashcardUtils"

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

export const getGlobalDecksByUserId = async (userId: string): Promise<GlobalDeckSnapshotIn[]> => {
  let { data: deck, error } = await supabase
    .from("global_decks")
    .select("*, private_global_flashcards(*)")
    .eq(Global_Deck_Fields.OWNER_ID, userId)

  if (deck && deck?.length > 0) {
    return deck.map((deck) => mapResponseToGlobalDeck(deck))
  }
  return null
}

export const mapResponseToGlobalDeck = (deck: any): GlobalDeckSnapshotIn => {
  return {
    [Deck_Fields.ID]: deck?.id,
    [Deck_Fields.TITLE]: deck?.title ? deck.title : undefined,
    private_global_flashcards: deck?.private_global_flashcards
      ? deck?.private_global_flashcards.map((card) => mapToGlobalFlashcard(card))
      : [],
  }
}

export const mapToGlobalFlashcard = (card: any): PrivateGlobalFlashcardsSnapshotIn => {
  return {
    [Flashcard_Fields.ID]: card?.id,
    [Flashcard_Fields.FRONT]: card?.front ? card?.front : undefined,
    [Flashcard_Fields.BACK]: card?.back ? card?.back : undefined,
    [Flashcard_Fields.SUB_HEADER]: card?.sub_header ? card?.sub_header : undefined,
    [Flashcard_Fields.EXTRA]: card?.extra ? card?.extra : undefined,
    [Flashcard_Fields.EXTRA_ARRAY]: card?.extra_array ? card?.extra_array : undefined,
    [Flashcard_Fields.PICTURE_URL]: card?.picture_url ? card?.picture_url : undefined,
    [Flashcard_Fields.CREATED_AT]: card?.created_at ? new Date(card?.created_at) : undefined,
  }
}

export const searchGlobalDecks = async (searchTerm: string) => {
  const search: string = "%" + searchTerm + "%"
  let { data, error } = await supabase.from("global_decks").select("*, global_flashcards(*)")

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

export const addToPrivateGlobalFlashcard = async (
  flashcard: any,
  deck_id: string,
): Promise<PrivateGlobalFlashcardsSnapshotIn> => {
  if (!deck_id || !flashcard) {
    console.log("Deck id or flashcard missing", flashcard, deck_id)
    return null
  }

  try {
    const { data, error } = await supabase
      .from("private_global_flashcards")
      .insert([
        {
          [Global_Flashcard_Fields.FRONT]: flashcard.front,
          [Global_Flashcard_Fields.BACK]: flashcard.back,
          [Global_Flashcard_Fields.EXTRA]: flashcard.extra,
          [Global_Flashcard_Fields.EXTRA_ARRAY]: flashcard.extra_array,
          [Global_Flashcard_Fields.SUB_HEADER]: flashcard.sub_header,
          [Global_Flashcard_Fields.PICTURE_URL]: flashcard.picture_url,
          [Global_Flashcard_Fields.DECK_ID]: deck_id,
        },
      ])
      .select()
    console.log(data, error, "add global res")
    if (data) {
      return mapToGlobalFlashcard(data[0])
    }
  } catch (error) {
    console.log(error)
  }
  return null
}
