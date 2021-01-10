import React from 'react'
import Helmet from 'react-helmet'
import Layout from '../../components/layout'
import Loader from '../../components/Loader';
import ConfigService from '../ConfigService';
import { LoadableAuthForm } from '../client_library';
import Logger from '../Logger';
import {bannerStyle, getBannerStyle} from '../styleBuilder';

class LoginIndex extends React.Component {
    constructor(props) {
        /* props.authService */
        super(props);
        const environment = new ConfigService().get_environment();
        this.state = {        
            environment: environment,    
            status: "initialized",
            isLoggedIn: false,
            alert: ""
        }
    }

    async componentDidMount() {
        let isLoggedIn = false;
        let alert = "";

        if (window.location.search.length > 0) {
            alert = "Confirming your authentication status?  Try refreshing!";
        } else {
            isLoggedIn = await this.props.authService.isLoggedIn();
            if (isLoggedIn) {
                
                alert = `Welcome Back`;                
            }
        }
        this.setState({ alert: alert, isLoggedIn: isLoggedIn, status: 'mounted' });
    }

    render() {     
        let environment = process.env.environment;
        
        if (this.state.status !== 'mounted') {
            return (<Loader />);
        } else if (this.state.isLoggedIn === true) {
            return (
                <Layout location={location}>
                    <Helmet title="Login" />
                    <div className="container main-content">
                        <div style={getBannerStyle(environment)}>
                            <h2>{this.state.alert}</h2>
                        </div>
                        <div className="columns has-text-centered">
                            <div className="column">
                            <a href="/app/feed" className="button is-large button-is-primary">
                                Check out the feed
                            </a>
                            </div>
                            
                        </div>
                    </div>
                </Layout>
            )
        } else {
            return (
                <Layout location={location}>
                    <div className="main-content">
                        <LoadableAuthForm />
                    </div>
                </Layout>
            );
        }
    }
}

export default LoginIndex
