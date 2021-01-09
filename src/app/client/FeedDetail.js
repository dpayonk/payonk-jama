import React, { Component } from "react"
import bannerImage from '../../../static/french-lick.jpg'


class FeedDetail extends Component {

    constructor(props) {
        // props.pic
        super(props);        
        this.state = {
        };
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(){

    }

    render() {
        return (
            <div key={this.props.pic.id} style={{ marginTop: "3vh" }} className="columns is-centered">
                <div style={{ textAlign: "center" }} className="column is-full">
                    <h3 style={{ paddingBottom: "3vh" }}>{this.props.pic.title}</h3>
                    <img style={{minHeight: "300px"}} alt={this.props.pic.title} className="feature-square-image" src={this.props.pic.image_url} />
                    <p>Commenting coming soon!</p>
                </div>
            </div>)
    }

}

export default FeedDetail