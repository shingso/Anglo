import { FlashcardSnapshotIn } from "app/models"
import { Deck } from "app/models/Deck"
import { supabase } from "app/services/supabase/supabase"

export interface AIResponse {
  data?: Partial<FlashcardSnapshotIn>
  remaining?: number
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
  if (data) return data
  return {}
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
  let language = null
  if (deck?.translateLanguage && deck?.translateLanguage != "english") {
    language = deck?.translateLanguage
  }
  const deckCustomPrompts = deck?.customPrompts
  return await getAIDefinition(
    word,
    language,
    deckCustomPrompts?.backPrompt,
    deckCustomPrompts?.extraPrompt,
    deckCustomPrompts?.extraArrayPrompt,
    deckCustomPrompts?.subheaderPrompt,
  )
}
