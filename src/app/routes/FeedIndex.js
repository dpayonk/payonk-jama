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

import 'semantic-ui-css/semantic.min.css';
import AccountProfileService from '../services/AccountProfileService'

class FeedIndex extends React.Component {
  constructor(props) {
    /* props.authService props.userSession */
    super(props);
    this.state = {
      pics: [],
      status: 'initialized',
      accountService: new AccountProfileService(),
      feedService: new FeedService()
    }
  }

  async isAuthorized() {
    let isAuthorized = false;

    isAuthorized = await this.state.accountService.getAuthorizationStatus(this.props.userSession.emailAddress, 'feed');
    return isAuthorized;
  }

  async componentDidMount() {

    try {
      let isAuthorized = await this.isAuthorized();
      if (isAuthorized) {
        Logger.info(`Fetching feed for ${this.props.userSession.emailAddress}`);
        let picsList = await this.state.feedService.fetchFeed(this.props.userSession.emailAddress);
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
    else if (this.isAuthorized() === false) {
      return this.renderUnauthorized();
    } else {
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
}

export default FeedIndex
