import React from "react"
import { Router } from "@reach/router"

// TODO: Implement in Client Components
// import PrivateRoute from "../components/PrivateRoute";
import FeedIndex from "../app/pages/FeedIndex"
import AuthIndex from "../app/pages/AuthIndex"
import { LoadableAuthForm } from "../app/client_library"
import AuthService from "../app/client/services/AuthService"
import Layout from '../components/layout'
import Loader from "../components/Loader"

import ProfileIndex from "../app/pages/ProfileIndex"


class App extends React.Component {
  // = () => {
  // // <PrivateRoute path="/" component={FeedIndex} />

  constructor(props) {
    super(props);
    this.state = {
      status: 'loading',
      isLoggedIn: false,
      alert: "Hang tight",
      service: new AuthService()
    };
  }

  async checkAuth() {
    try {
      let isLoggedIn = false;
      console.log("TODO: Figure out routing");
      if (window.location.search.length > 0) {
        this.setState({ alert: "Verifying credentials" });
        console.log("Found magic credential, checking auth");
        let result = await this.state.authService.onRedirectLogin();
        console.log("Result of onRedirectLogin");
        console.log(result);
        isLoggedIn = await this.state.service.isLoggedIn();
        console.log("Check log in status now?");
        this.setState({ status: 'complete', isLoggedIn: isLoggedIn });
      } else {
        this.setState({ alert: "No magic link in query string.  Verifying credentials"});
        isLoggedIn = await this.state.service.isLoggedIn();
        console.log("Log in status: " + isLoggedIn);
        this.setState({ isLoggedIn: isLoggedIn, status: 'complete' });
      }
      console.log(`Checked Auth Status: ${isLoggedIn}`);
    } catch (error) {
      console.log("Error checking auth");
      this.setState({ alert: "An exception occured. " });
      console.log(error);
    }
  }

  async componentDidMount() {
    console.log("App Mounted, checking auth");
    this.checkAuth();
    this.setState({ status: 'mounted' });
  }

  render() {
    if (this.state.status === 'loading') {
      return (
        <div style={{ textAlign: "center", marginTop: "33vh" }}>
          <p>{this.state.alert}</p>
          <Loader />
        </div>
      );
    }
    else if (this.state.status === 'complete' && this.state.isLoggedIn == false) {
      return (
        <Layout location={location}>
          <div className="columns is-centered" style={{ textAlign: "center", marginTop: "33vh" }}>
            <div className="is-half">
              <h2 style={{ textTransform: "none" }}>Sorry, nothing here for you.</h2>
              <LoadableAuthForm title="Ask for permission" />
            </div>
          </div>
        </Layout>
      );
    } else {
      return (
        <div>
          <Router basepath="/app">
            <AuthIndex path="/auth" />
            <ProfileIndex path="/profile" />
            <FeedIndex auth="validate" path="/" />
          </Router>
        </div>
      );
    }


  }
}

export default App