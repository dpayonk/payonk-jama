import React from "react"
import { navigate, Router } from "@reach/router"
import { Logger } from 'payonkjs';
import Layout from '../components/layout';
import Loader from "../components/Loader";
import FeedIndex from "../app/routes/FeedIndex"
import LoginIndex from "../app/routes/LoginIndex"
import ProfileIndex from "../app/routes/ProfileIndex"
import DebugIndex from "../app/routes/DebugIndex"
import CreatorIndex from '../app/routes/CreatorIndex'
import AuthService from "../app/services/AuthService";
import AccountProfileService from "../app/services/AccountProfileService";
import {StateStore, EventKeys} from '../app/StateStore';

import { LoadableDebugToolbar } from '../app/client_library';


class PrivateRoute extends React.Component {
  render() {
    if (this.props.isLoggedIn !== true) {
      navigate('/app/login');
      return (<LoginIndex alert="You are not authorized to view this page" />);
    }

    return (<div>
      {this.props.children}
    </div>

    )
  }
}

class Redirector extends React.Component {

  render() {
    if (this.props.isLoggedIn !== true) {
      navigate('/app/login');
      return (<LoginIndex alert="You have been logged out!" />);
    }

    return (
      <Layout>
        <div className="columns">
          <div style={{margin:"40px 0px"}} className="column has-text-centered">
          <h1>The page you are looking for does not exist</h1>
          </div>
        </div>
      </Layout>
    )
  }
}

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isLoggedIn: false,
      status: 'loading',
    };
    this.authService = AuthService.getInstance();

    let self = this;
    StateStore.subscribe(EventKeys.onLogout, function(){
      self.setState({isLoggedIn: false});
    });
  }

  async componentDidMount() {
    let isLoggedIn = false;

    try {

      if (window.location.search.length > 0) {
        // Looking for magic credential in query string
        let authenticationProfile = await this.authService.handleMagicAuthenticationRedirect();
        let accountProfile = await AccountProfileService.getInstance().createProfile(authenticationProfile);
        Logger.alert('app.js: Created profile!', accountProfile);
      }

      isLoggedIn = await this.authService.isLoggedIn();
    } catch (error) {
      Logger.error("app.js: An exception occurred loading the app.", error);
    }

    this.setState({
      status: 'mounted', isLoggedIn: isLoggedIn, status: 'mounted'
    });
  }

  onLogin(accountProfile) {
    if(accountProfile !== undefined && accountProfile !== null){

      this.setState({ isLoggedIn: true });
      navigate('/app/home');  
    }
  }

  render() {

    if (this.state.status === 'loading') {
      return (<Loader title="Hang tight, starting up the app!" />)
    }

    return (
      <div id="root">
        <LoadableDebugToolbar />
        <Router basepath="/app">
          <LoginIndex onLoginCallback={this.onLogin} path="/login" />
          <PrivateRoute isLoggedIn={this.state.isLoggedIn} path="/home">
            <ProfileIndex path="/profile" />
            <CreatorIndex path="/creator" />
          </PrivateRoute>
          <PrivateRoute isLoggedIn={this.state.isLoggedIn} path="/feed">
            <FeedIndex path="/" />
          </PrivateRoute>
          <PrivateRoute path="/profile" isLoggedIn={this.state.isLoggedIn}>
            <ProfileIndex path="/" />
          </PrivateRoute>
          <DebugIndex path="/debug" />
          <LoginIndex onLoginCallback={this.onLogin} path="/" />
          <Redirector isLoggedIn={this.state.isLoggedIn} default />
        </Router>
      </div>
    );
  }
}

export default App