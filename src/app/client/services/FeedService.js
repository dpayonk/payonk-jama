import ConfigService from '../../ConfigService'

class FeedService {

    statics() {
        const apiUrl = ConfigService.get('BACKEND_ENDPOINT');
        return {
          'apiEndpoint': `${apiUrl}/feed`
        }
      }
    

    async getFeed() {
        // TODO: Customize based on profile
        let data = { accessToken: 'static:TODO' };
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
            let picsList = await response.json();
            return picsList;
          } else {
            console.log("Route not available");
          }
        } catch (error) {
          console.log("Error getting feed", error);
        }
        return [];
      }
}

export default FeedService