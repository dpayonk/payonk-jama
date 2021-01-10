import React, { Component } from "react"
import bannerImage from '../../../static/french-lick.jpg'
//import Comments from './Comments'
import {LoadableComments} from '../client_library';

class FeedDetail extends Component {

    constructor(props) {
        // props.pic
        super(props);        
        this.state = {
            showComments: false
        };
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(){

    }

    render() {
        let commentDetails = (<div></div>);
        if(this.state.showComments === true){
            commentDetails = (<LoadableComments />);
        }
        return (
            <div key={this.props.pic.id} style={{ marginTop: "3vh" }} className="columns is-centered">
                <div className="column is-full">
                    <img style={{minHeight: "300px"}} alt={this.props.pic.title} className="feature-square-image" src={this.props.pic.image_url} />
                    <p style={{ paddingTop: "7px" }}>{this.props.pic.title}</p>
                    {commentDetails}
                </div>
            </div>)
    }

}

export default FeedDetail