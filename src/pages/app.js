import React from "react"
import { Router } from "@reach/router"

// TODO: Implement in Client Components
// import PrivateRoute from "../components/PrivateRoute";
import AboutIndex from "../pages/about"
import FeedIndex from "../app/pages/feed"
import {LoadableAuthForm} from "../app/client_library"
import AuthService from "../app/services/AuthService"
import Layout from '../components/layout'
import Loader from "../components/Loader"

import ProfileIndex from "../app/pages/profile"


class App extends React.Component { 
  // = () => {
  // // <PrivateRoute path="/" component={FeedIndex} />

  constructor(props) {
    super(props);
    this.state = {status:'loading', isLoggedIn: false, service: new AuthService()};
  }

  async checkAuth() {
    // for testing... await new Promise(r => setTimeout(r, 2000));
    let isLoggedInd = await this.state.service.isLoggedIn()
    this.setState({isLoggedIn: isLoggedInd, status: 'complete'});
  }

  async componentDidMount(){
    this.checkAuth();
  }

  render(){
    if (this.state.status == 'loading' ) {
      return (
        <div style={{textAlign: "center", marginTop: "33vh"}}>
          <Loader />
        </div>
      );
    }
    else if (!this.state.status !== 'loading' && !this.state.isLoggedIn){
      return (
        <Layout location={location}>
          <div className="columns is-centered" style={{textAlign: "center", marginTop: "33vh"}}>
            <div className="is-half">
            <h2>Sorry, nothing here for you.</h2>

              <LoadableAuthForm title="Ask for permission" />
            </div>
          </div>
        </Layout>
      );
    } 

    return (
      <div>
        <Router basepath="/app">
          <ProfileIndex path="/profile" />
          <FeedIndex auth="validate" path="/" />
        </Router>
      </div>
    );
  }
}

export default App