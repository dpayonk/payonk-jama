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
import ConfigService from "../app/ConfigService";

import 'semantic-ui-css/semantic.min.css'; // not working for some reason
import BaseService from "../app/base/BaseService";

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
      alert: "",
      serverHealth: false,
      isLoggedIn: false,
      status: 'loading',
      userSession: userSession,
      debugMode: true
    };
    this.authService = new AuthService();
    this.backend = new BaseService(ConfigService.getBackend());

    let self = this;

    // This requires a lot of coordination
    UserStore.onSessionUpdate(function (model) {
      Logger.info("received update, new Model", model);
      self.setState({ userSession: model });
    });

    Logger.subscribe("alert", function(props){
      /* Display to notification area */
      self.setState({alert: props.message});
      setTimeout(() => self.setState({alert:''}), 3000);
    });

    Logger.subscribe("debug", function(props){
      /* Display to notification area */
      self.setState({alert: props.message});
      setTimeout(() => self.setState({alert:''}), 3000);
    });

  }

  async componentDidMount() {
    let isLoggedIn = false;
    let alert = "";

    try {
      if (window.location.search.length > 0) {
        Logger.info("app.js: Magic credential detected. Check auth onRedirect");
        let authenticationProfile = await this.authService.onAuthenticationRedirectCallback();
        isLoggedIn = await this.authService.isLoggedIn();
        
        debugger;
        if (isLoggedIn) {
          debugger;
          let profileMessage = await AccountProfileService.getInstance().createProfile(authenticationProfile);
          Logger.alert('New Profile created', profileMessage);
        }
      } else {
        alert = "Magic link not found in query string.  Verifying credentials with API";
        this.setState({alert: alert});
        isLoggedIn = await this.authService.isLoggedIn();
        setTimeout(() => this.setState({alert:''}), 3000);
      }
      Logger.info(`app.js: Determined login status:`, isLoggedIn);
    } catch (error) {
      alert = "An exception occurred loading the app.";
      Logger.error(`app.js: Catching exception in checkAuth`, error);
    }

    let debugMode = ConfigService.getDebugMode();


    let serverHealth = await this.backend.getHealth();
    this.setState({ serverHealth: serverHealth , 
      debugMode: debugMode,
      status: 'mounted', isLoggedIn: isLoggedIn, status: 'mounted' });
  }

  render() {
    const alert = (this.state.alert === '') ? `Backend: ${ConfigService.getBackend()}` : this.state.alert;
    

    if (this.state.status === 'loading') {
      return (<Loader title="Hang tight, validating your account!" />)
    }

    if (this.state.status === 'mounted' && this.state.isLoggedIn === false) {
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
    }

    const alertVisibility = (this.state.debugMode) ? {visibility: 'hidden'} : {};
    let alertBackground = (this.state.serverHealth === true) ? "lightgreen" : 'red';

    return (
      <div>
        <div id="dev-bar" style={{
          background: alertBackground, 
          visibility: alertVisibility, 
          minWidth: "200px", padding:"7px", 
          position: "absolute", bottom: "0px", left: "0px"}}>
          {alert}
        </div>
        <Router basepath="/app">
          <LoginIndex userSession={this.state.userSession} path="/login" />
          <ProfileIndex userSession={this.state.userSession} path="/profile" />
          <FeedIndex userSession={this.state.userSession} path="/feed" />
          <CreatorIndex userSession={this.state.userSession} path="/creator" />
          <DebugIndex userSession={this.state.userSession}  path="/debug" />
          <FeedIndex userSession={this.state.userSession} path="/" />
        </Router>
      </div>
    );
  }
}

export default App