import React, { Component } from "react"
import PropTypes from "prop-types"
import { graphql } from 'gatsby'
import bannerImage from '../../static/french-lick.jpg'


import Loader from '../components/Loader';
// import LoadableAuthService from './client_library';
import AuthService from './services/AuthService'


class CliqueViewer extends Component {

  constructor(props) {
    super(props);

    this.state = {
      isAuthorized: false,
      username: "",
      ready: false,
      authService: new AuthService()
    };

    this.handleChange = this.handleChange.bind(this);
  }

  async componentDidMount() {
    // const isLoggedIn = await this.state.AuthService.isLoggedIn();       
    const profile = await this.state.authService.getProfile();

    if (profile !== null) {
      console.log(profile);
      this.setState({ isAuthorized: true, username: profile.email });
      console.log("running GQL");
      // TODO: This needs to be replaced to 
      // payonk-api for authorization
      // and payonk-api for images and locations
      // const contacts = await get(this, 'props.data.whealthy.contacts');

      this.setState({contacts: contacts});
    }

    // check to see is valid email
    this.setState({ ready: true });
  }

  handleChange(event) {
    this.setState({ email: event.target.value });
  }

  render() {
    let label = "Check out pics of our family!";

    if (!this.state.ready) {
      return (
        <div className="has-text-centered">
<Loader />
        </div>

        
      )
    } else {
      let personalizedMessage = this.state.username;
      const caption = "See our new family";
      // is authorized?
      return (
        <div>
        <div className="columns is-centered">
            <div className="column is-full has-text-centered">
            <h2>{personalizedMessage}</h2>
          </div>
        </div>
        <div style={{ marginTop: "10vh" }} className="columns is-centered">
          <div style={{ textAlign: "center" }} className="column is-full">
            <h3 style={{ paddingBottom: "3vh" }}>{caption}</h3>
            <img className="feature-square-image" src={bannerImage} />
          </div>
        </div>
        </div >);
    }

  }
}

export default CliqueViewer

