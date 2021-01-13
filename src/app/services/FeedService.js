import ConfigService from '../ConfigService';
import Logger from '../Logger';


class FeedService {

    statics() {
        const apiUrl = ConfigService.get('BACKEND_ENDPOINT');
        return {
          'apiEndpoint': `${apiUrl}/feed`,
          'routes': [{
            url: '/feed', params:[]
          }]
        }
      }

    async fetchFeed(emailAddress) {
        // TODO: Customize based on profile
        let data = {emailAddress: emailAddress, accessToken: 'static:TODO' };
        try {
          let response = await fetch(this.statics().apiEndpoint, {
            method: 'POST', // TODO: Change to post*GET, POST, PUT, DELETE, etc.
            mode: 'cors',
            cache: 'no-cache',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(data) // body data type must match "Content-Type" header
          });
          if (response.status === 200) {
            let jsonResponse = await response.json();
            return jsonResponse.data;
          } else {
            Logger.info(`Backend returned invalid response`);
          }
        } catch (error) {
          Logger.error(`FeedService: An error occurred contacting the server`, error);
        }
        return [];
      }
}

export default FeedService