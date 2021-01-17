import React from "react"
import { Router } from "@reach/router"
import Layout from '../components/layout';
import Loader from "../components/Loader";
import FeedIndex from "../app/routes/FeedIndex"
import LoginIndex from "../app/routes/LoginIndex"
import ProfileIndex from "../app/routes/ProfileIndex"
import DebugIndex from "../app/routes/DebugIndex"
import CreatorIndex from '../app/routes/CreatorIndex'
import Logger from '../app/Logger';
import AuthService from "../app/services/AuthService";
import AccountProfileService from "../app/services/AccountProfileService";
import UserStore from '../app/repository/UserStore';
import { LoadableAuthForm } from '../app/client_library';

import 'semantic-ui-css/semantic.min.css';

class App extends React.Component {

  statics() {
    return {
      'title': "This app requires you to be authenticated and authorized",
      'status': ['loading', 'mounted', 'complete'],
      'routes': { '/feed': 'Clique Viewer', '/profile': 'My Profile' }
    }
  }

  constructor(props) {
    super(props);
    let userSession = UserStore.loadUserSessionFromStorage();
    Logger.info(`Retreived userSession from storage`, userSession);
    this.state = {
      alert: "Hang tight",
      authService: new AuthService(),
      isLoggedIn: false,
      status: 'loading',
      userSession: userSession
    };

    let self = this;

    UserStore.onSessionUpdate(function (model) {
      Logger.info("received update, new Model", model);
      self.setState({ userSession: model });
    });    
  }

  async componentDidMount() {
    let isLoggedIn = false;
    let alert = "";

    try {
      if (window.location.search.length > 0) {
        Logger.info("app.js: Magic credential detected. Check auth onRedirect");
        let authenticationProfile = await this.state.authService.onAuthenticationRedirectCallback();
        // Create a Profile now
        let service = new AccountProfileService();
        service.createProfile(authenticationProfile);
        isLoggedIn = await this.state.authService.isLoggedIn();
        if(isLoggedIn){
          Logger.info(`TODO: Create Profile on backend`);
        }
      } else {
        alert = "No magic link in query string.  Verifying credentials";
        isLoggedIn = await this.state.authService.isLoggedIn();
      }
      Logger.info(`app.js: Determined login status:`, isLoggedIn);
    } catch (error) {
      alert = "An exception occurred loading the app.";
      Logger.error(`app.js: Catching exception in checkAuth`, error);
    }
    this.setState({ status: 'mounted', isLoggedIn: isLoggedIn, alert: alert, status: 'mounted' });
  }

  renderLoadingMessage() {
    return (<Loader title="Hang tight" />);
  }

  render() {
    Logger.info(`App.render(): loggedIn:${this.state.isLoggedIn}, status:${this.state.status}`);
    if (this.state.status === 'loading') {
      return this.renderLoadingMessage();
    }
    else if (this.state.status === 'mounted' && this.state.isLoggedIn === false) {
      return (
        <Layout location={location}>
          <div className="columns is-centered" style={{ textAlign: "center", marginTop: "33vh" }}>
            <div className="is-half">
              <h2 style={{ textTransform: "none" }}>{this.statics().title}</h2>
              <LoadableAuthForm title="Ask for permission" />
            </div>
          </div>
        </Layout>
      );
    } else {
      Logger.info(`Showing app routes with loginStatus: ${this.state.isLoggedIn}`)
      return (
        <div>
          <Router basepath="/app">
            <LoginIndex userSession={this.state.userSession} authService={this.state.authService} path="/login" />
            <ProfileIndex userSession={this.state.userSession} authService={this.state.authService} path="/profile" />
            <FeedIndex userSession={this.state.userSession} authService={this.state.authService} path="/feed" />
            <CreatorIndex userSession={this.state.userSession} authService={this.state.authService} path="/creator" />
            <DebugIndex userSession={this.state.userSession} authService={this.state.authService} path="/debug" />
            <FeedIndex userSession={this.state.userSession} authService={this.state.authService} path="/" />
          </Router>
        </div>
      );
    }

  }
}

export default App