import { supabase } from "app/services/supabase/supabase"

export const getAIDefinition = async (
  word: string,
  language: string = null,
  backPrompt: string = null,
  extraPrompt: string = null,
  extraArrayPrompt: string = null,
  subheaderPrompt: string = null,
): Promise<any> => {
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
  return data
}
