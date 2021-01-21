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
import { LoadableAuthForm, LoadableDebugToolbar } from '../app/client_library';
import 'semantic-ui-css/semantic.min.css'; // not working for some reason

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isLoggedIn: false,
      status: 'loading',
    };
    this.authService = new AuthService();

    let self = this;
    // This requires a lot of coordination, but the app is the only place we know 
    // we can subscribe to global updates (besides singletons loaded here? )
    // perhaps instantiate statestore here?
    UserStore.onSessionUpdate(function (model) {
      Logger.info("received update, new Model", model);
      self.setState({ userSession: model });
    });
  }

  async componentDidMount() {
    let isLoggedIn = false;

    try {

      if (window.location.search.length > 0) { 
        // Looking for magic credential in query string
        let authenticationProfile = await this.authService.onAuthenticationRedirectCallback();
        let accountProfile = AccountProfileService.getInstance().createProfile(authenticationProfile);
        Logger.alert('app.js: Create a new profile for you.', accountProfile);
      }

      isLoggedIn = await this.authService.isLoggedIn();
    } catch (error) {
      Logger.error("app.js: An exception occurred loading the app.", error);
    }
        
    this.setState({
      status: 'mounted', isLoggedIn: isLoggedIn, status: 'mounted'
    });
  }

  render() {

    if (this.state.status === 'loading') {
      return (<Loader title="Hang tight, starting up the app!" />)
    }

    if (this.state.status === 'mounted' && this.state.isLoggedIn === false) {
      return (
        <Layout location={location}>
          <div className="columns is-centered" style={{ textAlign: "center", marginTop: "33vh" }}>
            <div className="is-half">
              <LoadableAuthForm title="Ask for permission" />
            </div>
          </div>
        </Layout>
      );
    }

    return (
      <div id="root">
        <LoadableDebugToolbar />
        <Router basepath="/app">
          <LoginIndex path="/login" />
          <ProfileIndex path="/profile" />
          <FeedIndex path="/feed" />
          <CreatorIndex path="/creator" />
          <DebugIndex path="/debug" />
          <FeedIndex path="/" />
        </Router>
      </div>
    );
  }
}

export default App