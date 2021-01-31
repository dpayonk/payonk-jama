import React from 'react'
import Helmet from 'react-helmet'
import Layout from '../../components/layout'
import Loader from '../../components/Loader';
import ConfigService from '../ConfigService';
import StateStore from '../StateStore';
import {Logger} from 'payonkjs';
import { getBannerStyle } from '../styleBuilder';
import { LoadableAuthForm, LoadableFeedViewer } from '../client_library'
import FeedService from '../services/FeedService';
import { LoadableFilerobotImageEditor } from '../client_library'
import MediaUploader from '../client_components/MediaUploader';
import AccountProfileService from '../services/AccountProfileService';
import ServiceExplorer from '../client_components/dev_tools/ServiceExplorer';


class DebugIndex extends React.Component {
    constructor(props) {
        
        super(props);
        const environment = new ConfigService().get_environment();
        this.state = {
            environment: environment,
            status: "initialized",
            isLoggedIn: false,
            alert: "Use this to test backend functionality",
            pics: [],
            editImageUrL: 'https://nyc3.digitaloceanspaces.com/com.payonk.clique/20210114-181146--20210114-174832--stephen-walker-unsplash.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=KSB4OEBLVBM6HPQGPVDM%2F20210115%2Fnyc3%2Fs3%2Faws4_request&X-Amz-Date=20210115T001146Z&X-Amz-Expires=6000&X-Amz-SignedHeaders=host&X-Amz-Signature=2920e95f97ee6d1cbc0895f42ebb181f483c901ffe43943004e327955d20e750',
            editImageUrl: 'https://nyc3.digitaloceanspaces.com/com.payonk.clique/20210114-181146--20210114-174832--stephen-walker-unsplash.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=KSB4OEBLVBM6HPQGPVDM%2F20210115%2Fnyc3%2Fs3%2Faws4_request&X-Amz-Date=20210115T001146Z&X-Amz-Expires=6000&X-Amz-SignedHeaders=host&X-Amz-Signature=2920e95f97ee6d1cbc0895f42ebb181f483c901ffe43943004e327955d20e750',
            showImageEditor: false,
            feedService: new FeedService(),
            serviceResponse: null,
            services: [AccountProfileService],
            Log: []
        }

        let self = this;
        // redirect log output to view
        // Logger.redirectTo(function (message, obj) {
        //     let log = self.state.Log;
        //     log.push({ "message": message, "obj": obj, "key": self.uuidv4()});
        //     self.setState({ Log: log });
        // });
        StateStore.subscribe("imageUpload", function(props){            
            self.setState({editImageUrl: props.imageUrl})
        });
    }

    uuidv4() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }


    async componentDidMount() {
        // get an image to crop
        this.setState({ status: 'mounted' });
    }

    renderJsonOutput() {
        if (this.state.serviceResponse !== null) {
            return (<div>Not implemented</div>);
            //    return (<ReactJson src={this.state.serviceResponse} />)
        } else {
            return (<div>Nothing to see here</div>);
        }
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
                                <h3>Authentication Widget</h3>
                                <div>
                                    <LoadableAuthForm />

                                </div>
                                <div className="services-component">
                                    <h3>Service List</h3>
                                    <ServiceExplorer Klass={this.state.services[0]} />
                                </div>

                            </div>
                        </div>
                        <div className="columns is-multiline">
                            <div className="column is-three-fifths">
                                <h3>Console</h3>
                                <div className="container">

                                    <LoadableFeedViewer pics={this.state.pics} />
                                </div>
                            </div>
                            <div className="column is-two-fifths">

                            </div>
                        </div>
                    </div >
                </Layout >
            )
        }
    }
}

export default DebugIndex
