import React, { Component } from "react"
import PropTypes from "prop-types"
// import { graphql } from 'gatsby' // cant use gatsby because this is client side

/* Rethink structure with the above */
import bannerImage from '../../../static/french-lick.jpg'
import Loader from '../../components/Loader';

import AuthService from './services/AuthService' // Changed auth service architecture to be runtime oriented


class CliqueViewer extends Component {

  constructor(props) {
    super(props);

    this.state = {
      isAuthorized: false,
      username: "",
      personalizedMessage: "",
      ready: false,
      pics: []
    };

    this.handleChange = this.handleChange.bind(this);
  }

  async getFeed() {
    let data = { accessToken: 'static:TODO' };
    console.log("Capturing feed");
    try {
      let response = await fetch('https://api.payonk.com/feed', {
        method: 'GET', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        headers: {
          'Content-Type': 'application/json'
          // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        // body: JSON.stringify(data) // body data type must match "Content-Type" header
      });
      console.log(response);
      if (response.status === 200) {
        console.log("Setting pics response");
        let picsList = await response.json();
        console.log(picsList);
        this.setState({ pics: picsList });

      } else {
        console.log("Route not available");
      }

    } catch (error) {
      console.log("Error getting feed");
      console.log(error);
    }
  }

  async componentDidMount() {
    // const isLoggedIn = await this.state.AuthService.isLoggedIn();   
    let authService = new AuthService();
    const profile = await authService.getProfile();

    if (profile !== null) {
      console.log(profile);
      this.setState({ isAuthorized: profile.isAuthorized, username: profile.email });
      // TODO: This needs to be replaced to 
      // payonk-api for authorization
      // and payonk-api for images and locations
      // const contacts = await get(this, 'props.data.whealthy.contacts');
      const contacts = {};
      this.setState({ contacts: contacts });
      console.log("Trigger feed");
      this.getFeed();
    } else {
      this.setState({ isAuthorized: false, });
    }

    // check to see is valid email
    console.log("PICS STATE");
    console.log(this.state.pics);
    this.setState({ ready: true });
  }

  handleChange(event) {
    this.setState({ email: event.target.value });
  }

  renderUnauthorized() {
    return (
      <div>It does not appear you are authorized yet.</div>
    )
  }

  renderFeed() {
    const caption = "To be implemented in pics";
    const placeholderImage = bannerImage;

    if (this.state.pics.length === 0) {
      return (<div>Nothing to show yet</div>);
    } else {
      return (<div>
        <div>
          <h2>{this.state.personalizedMessage}</h2>
        </div>
        {
          this.state.pics.map((pic) => {
            return (
              <div key={pic.id} style={{ marginTop: "3vh" }} className="columns is-centered">
                <div style={{ textAlign: "center" }} className="column is-full">
                  <h3 style={{ paddingBottom: "3vh" }}>{pic.title}</h3>
                  <img className="feature-square-image" src={pic.image_url} />
                  <p>Commenting coming soon!</p>
                </div>
              </div>)
          })
        }


      </div >);
    }
  }

  render() {
    if (!this.state.ready) {
      return (<div className="has-text-centered"><Loader /></div>)
    } else {
      if (this.state.isAuthorized === true) {
        return this.renderFeed();
      }
      return this.renderUnauthorized();
    }

  }
}

export default CliqueViewer

