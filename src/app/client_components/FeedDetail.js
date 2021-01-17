import React, { Component } from "react"
import Logger from '../Logger';
import { Button, Image, Modal } from 'semantic-ui-react'
import CommentFeed from './CommentFeed';

class FeedDetail extends Component {

    constructor(props) {
        // props.pic
        super(props);
        this.state = {
            showModal: false
        };
        this.handleToggle = this.handleToggle.bind(this);
    }

    handleToggle() {
        Logger.info("Show detail in modal");
        if (this.state.showModal === true) {
            Logger.info("Hide Modal");
            this.setState({ showModal: false });
        } else {
            Logger.info("Show Modal");
            this.setState({ showModal: true });
        }
    }

    onActivate() {

    }

    show() {
        Logger.info("Display");
        this.setState({ showModal: true });
    }

    renderDetails() {
        return (
            <div>
                <Modal
                    onClose={this.handleToggle}
                    onOpen={this.handleToggle}
                    open={this.state.showModal}>
                    <Modal.Header>
                        <a onClick={this.handleToggle} className="delete is-medium is-pulled-right">Close</a>
                        <h2>{this.props.pic.title}</h2>

                    </Modal.Header>
                    <Modal.Content image>
                        <div style={{ margin: "7px 0px 7px 0px" }}>
                        <Image size='large' src={this.props.pic.image_url}  />
                        </div>
                    <div style={{ marginLeft: "7px" }} className="container">
                        <CommentFeed />
                    </div>
                    </Modal.Content>
                <Modal.Actions>
                    <a style={{ visibility: 'hidden' }} className="button button-is-primary is-pulled-right">
                        Like
                        </a>
                </Modal.Actions>
                </Modal>
            </div >
        )
    }

    render() {


        return (
            <div>
                <div key={this.props.pic.id} style={{ marginTop: "3vh" }} className="is-centered">
                    <img onClick={this.handleToggle} alt={this.props.pic.title} className="feature-square-image" src={this.props.pic.image_url} />                    
                    <div>
                        {this.renderDetails()}
                    </div>
                </div>
            </div>
        )

    }

}


export default FeedDetail