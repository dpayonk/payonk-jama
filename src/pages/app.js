import React from "react"
import { Router } from "@reach/router"
import FeedIndex from "../app/pages/FeedIndex"
import AuthIndex from "../app/pages/AuthIndex"
import AuthService from "../app/client/services/AuthService"

import Layout from '../components/layout';
import Loader from "../components/Loader";
import { LoadableAuthForm } from '../app/client_library';

import ProfileIndex from "../app/pages/ProfileIndex"


class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      status: 'loading',
      isLoggedIn: false,
      alert: "Hang tight",
      authService: new AuthService()
    };
  }

  statics() {
    return {
      'title': "This app requires you to be authenticated and authorized",
      'status': ['loading', 'mounted', 'complete'],
      'routes': { '/feed': 'Clique Viewer', '/profile': 'My Profile' }
    }
  }


  async checkAuth() {
    try {
      let isLoggedIn = false;

      if (window.location.search.length > 0) {
        console.log("Found magic credential, checking auth");
        let result = await this.state.authService.onRedirectLogin();
        console.log(`Result of onRedirectLogin ${result}`);
        isLoggedIn = await this.state.authService.isLoggedIn();
        console.log("Check log in status now?");
      } else {
        this.setState({ alert: "No magic link in query string.  Verifying credentials" });
        isLoggedIn = await this.state.authService.isLoggedIn();
      }

      this.setState({ isLoggedIn: isLoggedIn })
      console.log(`Checked Auth Status: ${isLoggedIn}`);
    } catch (error) {
      this.setState({ alert: "An exception occured. " });
      console.log(`Error checking auth: ${error}`);
    }
  }

  async componentDidMount() {
    console.log("App Mounted, checking auth");
    await this.checkAuth();
    this.setState({ status: 'mounted' });
  }

  render() {
    console.log(`App.render(): loggedIn:${this.state.isLoggedIn}, status:${this.state.status}`);
    if (this.state.status === 'loading') {
      return (
        <div style={{ textAlign: "center", marginTop: "33vh" }}>
          <p>{this.state.alert}</p>
          <Loader />
        </div>
      );
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
      console.log(`Showing app routes with loginStatus: ${this.state.isLoggedIn}`)
      return (
        <div>
          <Router basepath="/app">
            <AuthIndex path="/login" />
            <ProfileIndex path="/profile" />
            <FeedIndex authService={this.state.authService} path="/feed" />
            <FeedIndex authService={this.state.authService} path="/" />
          </Router>
        </div>
      );
    }


  }
}

export default App