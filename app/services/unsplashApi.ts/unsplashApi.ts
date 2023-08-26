import { ApisauceInstance, create } from "apisauce"
import Config from "../../config"
import { ApiConfig } from "../api"

const base_url = "https://api.unsplash.com/"
const public_access = "Jpv_n2HmcDslI8lXZYaqKdDZGAJiy8xMTOfiNnGk5mE"
export const DEFAULT_API_CONFIG: ApiConfig = {
  url: Config.API_URL,
  timeout: 10000,
}

export class UnsplashApi {
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
    this.apisauce.headers["Authorization"] = "Client-ID " + public_access
  }

  searchWords = (searchTerm: string): Promise<any[]> => {
    const searchQuery = `search/photos?query=${searchTerm}`
    console.log("search term", searchQuery)
    return this.apisauce.get(searchQuery).then((response) => {
      if (response.data) {
        return response.data.results.map((result) => result.urls.full)
      }
    })

    return null
  }
}
// Singleton instance of the API for convenience
export const unsplashApi = new UnsplashApi()
