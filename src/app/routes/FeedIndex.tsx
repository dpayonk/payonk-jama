import React from 'react'
import get from 'lodash/get'
import Helmet from 'react-helmet'
import Layout from '../../components/layout'
import { LoadableFeedViewer } from '../client_library'
import Loader from '../../components/Loader'
import FeedService from '../services/FeedService'
import Logger from '../Logger'
import AccountProfileService from '../services/AccountProfileService'
import AccountProfile from '../models/AccountProfile'

type ProfileProps = {
}


type ProfileState = {
  alert: string
  isAuthorized: boolean
  pics: []
  status: string
  accountProfile: AccountProfile
}

class FeedIndex extends React.Component<ProfileProps, ProfileState> {
  accountProfileService: AccountProfileService
  feedService: FeedService

  constructor(props) {
    super(props)

    this.state = {
      isAuthorized: false,
      alert: '',
      pics: [],
      status: 'initialized',
      accountProfile: null
    }
    this.feedService = new FeedService()
    this.accountProfileService = AccountProfileService.getInstance();
  }

  async componentDidMount() {
    let isAuthorized = false;

    try {
      // this route should not be called unless already authenticated   
      let accountProfile = await this.accountProfileService.fetchMyProfile();
      
      this.setState({accountProfile: accountProfile});
      // could move to fetchMyProfile and return permissions?
      isAuthorized = await this.accountProfileService.fetchAuthorizationStatus(
        this.state.accountProfile.emailAddress,
        'feed'
      )

      if (isAuthorized) {
        let picsList = await this.feedService.fetchMyFeed()
        this.setState({ pics: picsList })
      }

      Logger.info(`FeedViewer: Setting Authorization Status: ${isAuthorized}`, isAuthorized);
    } catch (error) {
      Logger.error(`FeedViewer: Error occured mounting`, error)
    }
    this.setState({ status: 'mounted', isAuthorized: isAuthorized })
  }

  render() {
    const siteTitle = get(
      this,
      'props.data.cosmicjsSettings.metadata.site_title'
    )
    const location = get(this, 'props.location')

    if (this.state.status !== 'mounted') {
      return <Loader title="Capturing memories" />
    }

    if (this.state.isAuthorized === false) {
      return (<div>It does not appear you are authorized yet.</div>);
    }

    return (
      <Layout location={location}>    
        <Helmet title={siteTitle} />
        <div className="container main-content">
          <h1 className="has-text-centered">Our Family Feed</h1>
          <div className="container">
            <LoadableFeedViewer
              pics={this.state.pics}
            />
          </div>
        </div>
      </Layout>
    )
  }
}

export default FeedIndex
