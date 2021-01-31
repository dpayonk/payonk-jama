import React from 'react'
import Helmet from 'react-helmet'
import {Logger} from 'payonkjs';
import Layout from '../../components/layout'
import Loader from '../../components/Loader';
import ConfigService from '../ConfigService';
import StateStore from '../StateStore';
import { getBannerStyle } from '../styleBuilder';
import FeedService from '../services/FeedService';
import { LoadableFilerobotImageEditor } from '../client_library'
import MediaUploader from '../client_components/MediaUploader';


class CreatorIndex extends React.Component {
    constructor(props) {
        super(props);
        const environment = new ConfigService().get_environment();
        this.state = {
            environment: environment,
            status: "initialized",
            isLoggedIn: false,
            alert: "Create a piece of content...",
            editImageUrl: 'https://nyc3.digitaloceanspaces.com/com.payonk.clique/20210114-181146--20210114-174832--stephen-walker-unsplash.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=KSB4OEBLVBM6HPQGPVDM%2F20210115%2Fnyc3%2Fs3%2Faws4_request&X-Amz-Date=20210115T001146Z&X-Amz-Expires=6000&X-Amz-SignedHeaders=host&X-Amz-Signature=2920e95f97ee6d1cbc0895f42ebb181f483c901ffe43943004e327955d20e750',
            feedService: new FeedService(),
            Log: [],
            pics: []
        }

        let self = this;
        StateStore.subscribe("imageUpload", function (props) {
            self.setState({ editImageUrl: props.imageUrl })
        });
    }

    async componentDidMount() {
        // get an image to crop
        this.setState({ status: 'mounted' });
    }

    render() {

        let environment = process.env.environment;
        const myTheme = {
            // Theme object to extends default dark theme.
        };

        Logger.info(`ImageURL: ${this.state.editImageUrl}`);

        if (this.state.status !== 'mounted') {
            return (<Loader />);
        } else {
            return (
                <Layout location={location}>
                    <Helmet title="Login" />
                    <div className="container">
                        <div className="columns is-multiline">
                            <div className="column is-full">
                                <div style={getBannerStyle(environment)}>
                                    <h2>{this.state.alert}</h2>
                                </div>
                            </div>
                            <div className="column is-three-fifths">
                                <div style={{ margin: "4px" }} className="is-pulled-right">
                                    <MediaUploader />
                                </div>
                                <h2>Component</h2>

                                <div className="image-editor">

                                    <img src={this.state.editImageUrl}
                                        onClick={() => { this.setState({ isShow: true }); }} alt="example image" />

                                    <LoadableFilerobotImageEditor
                                        show={this.state.isShow}
                                        onUpload={(img) => { console.log(img); }}
                                        src={this.state.editImageUrl}
                                        onClose={() => { this.setState({ isShow: false }); }}
                                    />
                                </div>

                            </div>

                            <div className="column is-two-fifths">
                                <h3>Sidebar</h3>
                            </div>
                        </div>
                    </div >
                </Layout >
            )
        }
    }
}

export default CreatorIndex
