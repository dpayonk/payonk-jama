import React from 'react'
import Helmet from 'react-helmet'
import Layout from '../../components/layout'
import Loader from '../../components/Loader';
import ConfigService from '../ConfigService';
import { LoadableAuthForm } from '../client_library';
import Logger from '../Logger';
import { bannerStyle, getBannerStyle } from '../styleBuilder';

import { LoadableFeedViewer } from '../client_library'


class RpcExplorer extends React.Component {
    constructor(props) {
        /* props.authService */
        super(props);
        const environment = new ConfigService().get_environment();
        this.state = {
            environment: environment,
            status: "initialized",
            isLoggedIn: false,
            alert: "Use this to test backend functionality",
            pics: []
        }
    }

    async componentDidMount() {
        this.setState({ status: 'mounted' });
    }

    render() {
        let environment = process.env.environment;

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
                                <h3>List of services</h3>
                                <ul>
                                    <li>Auth Service</li>
                                    <li>Feed Service</li>
                                </ul>
                            </div>

                            <div className="column is-two-fifths">
                                <h3>Auth Form</h3>
                                <LoadableAuthForm />
                            </div>
                        </div>
                        <div className="columns is-multiline">
                            <div className="column is-three-fifths">
                                <h3>Results</h3>
                                <div className="result">
                                    Service Responses
                                </div>
                            </div>
                            <div className="column is-two-fifths">
                                <h3>Components</h3>
                                <div className="container">
                                    <h4>Feed Component</h4>
                                    <LoadableFeedViewer pics={this.state.pics} userModel={this.props.userModel} />
                                </div>
                            </div>
                        </div>
                    </div>
                </Layout>
            )
        }
    }
}

export default RpcExplorer
