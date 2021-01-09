import React, { Component } from "react"
import bannerImage from '../../../static/french-lick.jpg'
import Loader from '../../components/Loader';
import UserModel from "./UserModel";
import FeedDetail from './FeedDetail';


class FeedViewer extends Component {
  statics() {
    return {
      apiEndpoint: "https://api.payonk.com/feed"
    }
  }

  constructor(props) {
    super(props);
    this.state = {
      isAuthorized: false,
      personalizedMessage: "",
      status: "initialized",
      pics: []
    };

    this.handleChange = this.handleChange.bind(this);
  }

  async getFeed(profile) {
    // TODO: Customize based on profile
    let data = { accessToken: 'static:TODO' };
    try {
      let response = await fetch(this.statics().apiEndpoint, {
        method: 'GET', // TODO: Change to post*GET, POST, PUT, DELETE, etc.
        mode: 'cors',
        cache: 'no-cache',
        headers: {
          'Content-Type': 'application/json'
        },
        // body: JSON.stringify(data) // body data type must match "Content-Type" header
      });
      if (response.status === 200) {
        let picsList = await response.json();
        this.setState({ pics: picsList });
      } else {
        console.log("Route not available");
      }
    } catch (error) {
      console.log("Error getting feed", error);
    }
  }

  async componentDidMount() {

    try {
      const userModel = UserModel.loadModelFromStorage();
      if (userModel !== null) {
        const isAuthorized = await this.props.authService.isAuthorized(userModel.emailAddress, 'feed');
        this.setState({ isAuthorized: isAuthorized })
        console.log(`Authorization Status: ${isAuthorized}`);
      } else {
        this.setState({ isAuthorized: false });
        console.log("FeedViewer.componentDidMount could not get userModel");
        this.setState({ alert: "We could not retrieve user credentials" });
      }

    } catch (error) {
      console.log(`Error occured in CliqueViewer`, error);
    }

    // Customize Feed based on profile, should we move profile
    const profile = await this.props.authService.getProfile();
    if (profile !== null) {
      console.log("Fetching feed for profile", profile);
      this.getFeed(profile);
    }
    this.setState({ status: 'mounted' });
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
              <FeedDetail key={pic.id} pic={pic} />
            )
          })
        }
      </div >);
    }
  }

  render() {
    if (this.state.status !== 'mounted') {
      return (<Loader />)
    } else {
      if (this.state.isAuthorized === true) {
        return this.renderFeed();
      }
      return this.renderUnauthorized();
    }
  }
}

export default FeedViewer

