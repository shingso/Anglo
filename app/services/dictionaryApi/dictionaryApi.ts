import { ApisauceInstance, create } from "apisauce"
import Config from "../../config"
import { ApiConfig } from "../api"

//const base_url = "https://jmia1idp7k.execute-api.us-east-1.amazonaws.com/alpha"
const base_url = "https://tmyaic09ua.execute-api.us-east-1.amazonaws.com/alpha"

export const DEFAULT_API_CONFIG: ApiConfig = {
  url: Config.API_URL,
  timeout: 10000,
}
//https://od-api.oxforddictionaries.com/api/v2/entries/en-gb/{search}?strictMatch=true
/**
 * Manages all requests to the API. You can use this class to build out
 * various requests that you need to call from your backend API.
 */

export interface DictionaryResponse {
  back?: string
  extra?: string
  front?: string
  extra_array?: string[]
  type?: string
  difficulty?: number
  sub_header?: string
}

export class DictionaryApi {
  apisauce: ApisauceInstance
  config: ApiConfig

  /**
   * Set up our API instance. Keep this lightweight!
   */
  constructor(config: ApiConfig = DEFAULT_API_CONFIG) {
    this.config = config
    this.apisauce = create({
      baseURL: base_url,
      timeout: this.config.timeout,
      headers: {
        Accept: "application/json",
      },
    })
  }

  getEntry = (entry: string): Promise<DictionaryResponse> => {
    const searchQuery = `/${entry.toLowerCase()}`
    console.log("search term", searchQuery)

    return this.apisauce.get(searchQuery).then((response: any) => {
      console.log(response)
      if (response.data?.error) {
        console.log(response.data?.error, "THERE WAS AN ERROR")
        return null
      }
      if (response?.data?.entries && response?.data?.entries.length > 0) {
        const data = response.data?.entries
        console.log(data)
        const firstEntry = data[0]
        const firstLexemes = firstEntry?.lexemes[0]
        const firstDefinition = firstLexemes?.senses[0]
        const dictionaryEntry: DictionaryResponse = {
          front: firstEntry?.entry,
          back: firstDefinition?.definition,
          extra: firstDefinition?.usageExamples ? firstDefinition?.usageExamples[0] : null,
          difficulty: data?.frequency,
          type: firstLexemes?.partOfSpeech,
          sub_header:
            firstEntry?.pronunciations && firstEntry?.pronunciations[0]?.transcriptions
              ? firstEntry?.pronunciations[0]?.transcriptions[0]?.transcription
              : null,
          extra_array:
            firstLexemes?.synonymSets && firstLexemes?.synonymSets[0]?.synonyms
              ? firstLexemes?.synonymSets[0].synonyms.splice(0, 3)
              : [],
        }
        return dictionaryEntry
      }
      return {}
    })
  }
}

// Singleton instance of the API for convenience
export const dictionaryApi = new DictionaryApi()
