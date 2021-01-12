import React, { Component } from "react"
import Loader from '../../components/Loader';
import UserModel from "./UserModel";
import FeedDetail from './FeedDetail';
import ConfigService from '../ConfigService';
import Logger from "../Logger";


class FeedViewer extends Component {
  statics() {
    const apiUrl = ConfigService.get('BACKEND_ENDPOINT');
    return {
      'apiEndpoint': `${apiUrl}/feed`
    }
  }

  constructor(props) {
    super(props);
    /* props.userModel */
    this.state = {
      personalizedMessage: "",
      status: "initialized"
    };

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    this.setState({ email: event.target.value });
  }

  async componentDidMount() {
    Logger.info("Mounted");
    this.setState({ status: 'mounted' });
  }

  renderDetail(pic) {
    return (<FeedDetail key={pic.id} pic={pic} />);
  }

  renderFeed() {
    console.log(this.props);
    if (this.props.pics.length === 0) {
      return (<div>Nothing to show yet</div>);
    } else {
      return (<div>
        <div>
          <h2>{this.props.personalizedMessage}</h2>
        </div>
        <div>
          <div className="columns is-multiline">
            {
              this.props.pics.map((pic) => {
                return (
                  <div key={pic.id} style={{ border: "2px" }} className="column is-4">

                    <div key={pic.id} className="column is-full">
                      <img alt={pic.title} className="feature-square-image" src={pic.image_url} />
                      <p style={{ paddingTop: "7px" }}>{pic.title}</p>
                    </div>

                  </div>
                )
              })
            }
          </div>
        </div>
      </div >);
    }
  }

  render() {
    if (this.state.status !== 'mounted') {
      return (<Loader />)
    } else {
      return this.renderFeed()
    }
  }
}

export default FeedViewer

