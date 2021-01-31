import { BaseService, Logger } from 'payonkjs'
import ConfigService from '../ConfigService'

class FeedService extends BaseService {
  statics() {
    const apiUrl = ConfigService.get('BACKEND_ENDPOINT')
    return {
      apiEndpoint: `${apiUrl}/feed`,
      routes: [
        {
          url: '/feed',
          params: [],
        },
      ],
    }
  }

  async fetchMyFeed(): Promise<[]> {
    // TODO: Customize based on profile
    try {
      // this.apiGet()
      let response = await fetch(this.statics().apiEndpoint, {
        method: 'POST',
        mode: 'cors',
        cache: 'no-cache',
        headers: this.generateHeaders(),
      })
      if (response.ok) {
        let jsonResponse = await response.json()
        if (jsonResponse.data != null) {
          return jsonResponse.data.pics
        } else {
          Logger.info(
            `FeedService.fetchFeed: Could not parse result `,
            jsonResponse.data
          )
        }
      } else {
        Logger.info(`FeedService.fetchFeed: Fetching error`, response.status)
      }
    } catch (error) {
      Logger.error(
        `FeedService: An error occurred contacting the server`,
        error
      )
    }
    return []
  }
}

export default FeedService
