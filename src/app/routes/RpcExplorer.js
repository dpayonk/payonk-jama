import React from 'react'
import Helmet from 'react-helmet'
import Layout from '../../components/layout'
import Loader from '../../components/Loader';
import ConfigService from '../ConfigService';
import Logger from '../Logger';
import { getBannerStyle } from '../styleBuilder';

import { LoadableAuthForm, LoadableFeedViewer } from '../client_library'
import FeedService from '../services/FeedService';
import UserModel from '../client/UserModel';
import Loadable from "@loadable/component"


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
            pics: [],
            services: [
                { key: 'feed', klass: FeedService },
                { key: 'profile', klass: UserModel },
            ],
            serviceResponse: null,
            Log: []
        }

        let self = this;
        // redirect log output to view
        Logger.redirectTo(function (message, obj) {
            let log = self.state.Log;
            log.push({ "message": message, "obj": obj });
            self.setState({ Log: log });
        });
    }

    async componentDidMount() {
        this.setState({ status: 'mounted' });
    }

    displayServiceMethods(Klass) {
        try {
            const klass = new Klass();
            const serviceConfiguration = klass.statics();
            const methods = serviceConfiguration.routes;
            return (<div>
                <h6>{serviceConfiguration.apiEndpoint}</h6>
                <ul>
                    {
                        methods.map((route) => {
                            return (<li>{route.url} / params: {JSON.stringify(route.params)}</li>);
                        })
                    }
                </ul>
            </div>);
        } catch (error) {
            return (<div>Could not parse methods</div>);
        }
        // return [...properties.keys()].filter(item => typeof obj[item] === 'function')
    }

    renderJsonOutput() {
        if (this.state.serviceResponse !== null) {
            return (<div>Not implemented</div>);
            //    return (<ReactJson src={this.state.serviceResponse} />)
        } else {
            return (<div>Nothing to see here</div>);
        }
    }

    renderServiceList() {

        return (<ul className="">
            {
                this.state.services.map((service) => {
                    return (
                        <li key={service.key} style={{ border: "2px" }} className="column is-4">
                            {service.key}
                            <div>{this.displayServiceMethods(service.klass)}</div>
                        </li>
                    )
                })
            }
        </ul>);
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
                                {this.renderServiceList()}
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
                                    {this.renderJsonOutput()}
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
