import React from 'react'
import get from 'lodash/get'
import Helmet from 'react-helmet'
import Layout from '../../components/layout'
import { LoadableFeedViewer } from '../client_library'
import ConfigService from '../ConfigService'
import { getBannerStyle } from '../styleBuilder';
import Loader from '../../components/Loader';
import FeedService from "../services/FeedService";
import Logger from "../Logger";
import AccountProfileService from '../services/AccountProfileService'
import UserSession from '../models/UserSession'
import 'semantic-ui-css/semantic.min.css';

type ProfileProps = {
  userSession: UserSession;
}

type ProfileState = {
  alert: string;
  isAuthorized: boolean;
  pics: [];
  status: string;
}

class FeedIndex extends React.Component<ProfileProps, ProfileState> {
  accountService: any
  feedService: FeedService

  constructor(props) {
    /* props.userSession */
    super(props);
    this.state = {
      isAuthorized: false,
      alert: "",
      pics: [],
      status: 'initialized',
    }
    this.feedService = new FeedService();
    this.accountService = AccountProfileService.getInstance();
  }

  async fetchAuthorization() {
    let isAuthorized = false;

    isAuthorized = await this.accountService.fetchAuthorizationStatus(
      this.props.userSession.authenticationProfile.emailAddress, 'feed');

    this.setState({ isAuthorized: isAuthorized });
    return isAuthorized;
  }

  async componentDidMount() {

    try {
      let isAuthorized = await this.fetchAuthorization();
      if (isAuthorized) {
        Logger.info(`Fetching feed for ${this.props.userSession.authenticationProfile.emailAddress}`);
        let picsList = await this.feedService.fetchFeed(this.props.userSession.authenticationProfile.emailAddress);
        this.setState({ pics: picsList });
      } else {
        console.log("FeedViewer.componentDidMount could not get userSession");
        this.setState({ alert: "We could not retrieve user credentials" });
      }
      Logger.info(`FeedViewer: Setting Authorization Status: ${isAuthorized}`);
    } catch (error) {
      Logger.error(`FeedViewer: Error occured mounting`, error);
    }
    this.setState({ status: 'mounted' });
  }

  renderUnauthorized() {
    return (
      <div>It does not appear you are authorized yet.</div>
    )
  }


  render() {
    const siteTitle = get(
      this,
      'props.data.cosmicjsSettings.metadata.site_title'
    )
    const location = get(this, 'props.location')
    let cfg = new ConfigService();
    const environment = cfg.get_environment();

    if (this.state.status !== 'mounted') {
      return (<Loader title="Capturing memories" />);
    }
    if (this.state.isAuthorized === false) {
      return this.renderUnauthorized();
    }

    return (
      <Layout location={location}>
        <div style={getBannerStyle(environment)}>{environment}</div>
        <Helmet title={siteTitle} />
        <div className="container main-content">
          <h1 className="has-text-centered">Our Family Feed</h1>
          <div className="container">
            <LoadableFeedViewer pics={this.state.pics} userSession={this.props.userSession} />
          </div>
        </div>
      </Layout>
    )
  }
}

export default FeedIndex
