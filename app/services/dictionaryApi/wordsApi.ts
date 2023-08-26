//this dictionary api is for gettingt the frequency
import { ApisauceInstance, create } from "apisauce"
import Config from "../../config"
import { ApiConfig } from "../api"
import { GlobalFlashcard, updateGlobalFlashcard } from "../../utils/globalFlashcardsUtils"

const base_url = "https://wordsapiv1.p.rapidapi.com"

export const DEFAULT_API_CONFIG: ApiConfig = {
  url: Config.API_URL,
  timeout: 10000,
}

export interface wordsResponse {
  frequency?: number
  syllables?: number
}

export class WordsApi {
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
        "X-RapidAPI-Key": "db560aaf1amsh1451ffc8e3be32dp152dc8jsn4f5c4bccf234",
        "X-RapidAPI-Host": "wordsapiv1.p.rapidapi.com",
        Accept: "application/json",
      },
    })
  }

  searchWords = (searchTerm: string) => {
    const searchQuery = "/words/" + searchTerm
    console.log("search term here2342", searchQuery)
    this.apisauce.get(searchQuery).then((response) => {
      console.log("response", response.data)
    })
  }

  updateWordsData = async (words: string[]) => {
    words.forEach(async (word) => {
      const wordData = await this.getEntry(word)
      if (wordData) {
        const updatedFlashcard: GlobalFlashcard = {
          front: word.toLowerCase(),
          frequency: wordData?.frequency,
          syllables: wordData?.syllables,
        }
        console.log("updated flashcard", updatedFlashcard)
        const data = await updateGlobalFlashcard(updatedFlashcard)
      }
    })
  }

  getEntry = (entry: string): Promise<wordsResponse> => {
    const searchQuery = "/words/" + entry.toLowerCase()

    return this.apisauce.get(searchQuery).then((response: any) => {
      if (response.data?.error) {
        return null
      }
      if (response?.data) {
        const data = response.data
        const wordsEntry: wordsResponse = {
          frequency: data?.frequency,
          syllables: data?.syllables?.count,
        }
        return wordsEntry
      }
      return null
    })
  }
}

// Singleton instance of the API for convenience
export const wordsApi = new WordsApi()
