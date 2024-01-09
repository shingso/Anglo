import { FlashcardSnapshotIn } from "app/models"
import { Deck } from "app/models/Deck"
import { supabase } from "app/services/supabase/supabase"

export interface AIResponse {
  data?: {
    error?: { message?: string; remaining?: number }
    back?: string
    extra?: string
    extra_array?: string[]
    sub_header?: string
    remaining?: number
  }
  error?: any
}

export const getAIDefinition = async (
  word: string,
  language: string = null,
  backPrompt: string = null,
  extraPrompt: string = null,
  extraArrayPrompt: string = null,
  subheaderPrompt: string = null,
): Promise<AIResponse> => {
  const { data, error } = await supabase.functions.invoke("ai-functions", {
    body: JSON.stringify({
      word,
      language,
      backPrompt,
      extraPrompt,
      extraArrayPrompt,
      subheaderPrompt,
    }),
  })
  if (data) {
    return data
  } else {
    return { data, error }
  }
}

export const getRemainingRateLimit = async () => {
  const { data, error } = await supabase.functions.invoke("getRateLimit")
  console.log(data, error, "remaining response")
  return data
}

export const getAIDefintionWithDeckPrompts = async (
  deck: Deck,
  word: string,
): Promise<AIResponse> => {
  const deckCustomPrompts = deck?.customPrompts
  const { data, error } = await getAIDefinition(
    word,
    deck?.translateLanguage,
    deckCustomPrompts?.backPrompt,
    deckCustomPrompts?.extraPrompt,
    deckCustomPrompts?.extraArrayPrompt,
    deckCustomPrompts?.subheaderPrompt,
  )
  console.log("result for ai", deckCustomPrompts.extraPrompt)
  return { data, error }
}
