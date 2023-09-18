import { supabase } from "app/services/supabase/supabase"

export const getAIDefinition = async (word: string, language: string = null): Promise<any> => {
  const { data, error } = await supabase.functions.invoke("ai-functions", {
    body: JSON.stringify({ word: word, language: language }),
  })
  return data
}
