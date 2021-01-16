import React from "react"
import { Router } from "@reach/router"
import FeedIndex from "../app/routes/FeedIndex"
import LoginIndex from "../app/routes/LoginIndex"
import ProfileIndex from "../app/routes/ProfileIndex"
import DebugIndex from "../app/routes/DebugIndex"
import CreatorIndex from '../app/routes/CreatorIndex'
import Layout from '../components/layout';
import Loader from "../components/Loader";
import Logger from '../app/Logger';
import AuthService from "../app/services/AuthService"

import UserModel from '../app/models/UserModel';
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
    let userModel = UserModel.loadModelFromStorage();
    Logger.info(`Retreived userModel from storage`, userModel);
    this.state = {
      alert: "Hang tight",
      authService: new AuthService({ userModel }),
      isLoggedIn: false,
      status: 'loading',
      userModel: userModel
    };

    let self = this;
    UserModel.onUpdate(function (userModel) {
      Logger.info("received update, new Model", userModel);
      self.setState({ userModel: userModel });
    });
    // TODO: Subscribe to UserModel changes
  }

  async componentDidMount() {
    let isLoggedIn = false;
    let alert = "";

    try {
      if (window.location.search.length > 0) {
        Logger.info("app.js: Magic credential detected. Check auth onRedirect");
        let result = await this.state.authService.onRedirectLogin();
        isLoggedIn = await this.state.authService.isLoggedIn();
        if(isLoggedIn){
          console.log("Auth Service createOrUpdateProfile");
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
            <LoginIndex userModel={this.state.userModel} authService={this.state.authService} path="/login" />
            <ProfileIndex userModel={this.state.userModel} authService={this.state.authService} path="/profile" />
            <FeedIndex userModel={this.state.userModel} authService={this.state.authService} path="/feed" />
            <CreatorIndex userModel={this.state.userModel} authService={this.state.authService} path="/creator" />
            <DebugIndex userModel={this.state.userModel} authService={this.state.authService} path="/debug" />
            <FeedIndex userModel={this.state.userModel} authService={this.state.authService} path="/" />
          </Router>
        </div>
      );
    }

  }
}

export default App