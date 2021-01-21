import React from 'react'
import Helmet from 'react-helmet'
import Layout from '../../components/layout'
import Loader from '../../components/Loader';
import ConfigService from '../ConfigService';
import { LoadableAuthForm } from '../client_library';
import Logger from '../Logger';
import { bannerStyle, getBannerStyle } from '../styleBuilder';
import AuthService from '../services/AuthService';
import AccountProfileService from '../services/AccountProfileService';

class LoginIndex extends React.Component {
    // User should already be authenticated and validated from the app.js
    // consider changing this to a confirmation page of sorts to enter in 
    // other information and create/edit or tutorial
    constructor(props) {
        super(props);
        const environment = new ConfigService().get_environment();
        this.state = {
            environment: environment,
            status: "initialized",
            isLoggedIn: false,
            feedAuthorization: false,
            accountService: new AccountProfileService(),
            alert: ""
        }
        this.authService = AuthService.getInstance();
    }

    async componentDidMount() {
        let alert = "";

        let isLoggedIn = await this.authService.isLoggedIn();
        if (isLoggedIn) {
            alert = `Welcome Back`;
            let authenticationProfile = await this.authService.getAuthenticationProfile();
            if (authenticationProfile !== null) {
                let authorized = await this.state.accountService.fetchAuthorizationStatus(authenticationProfile.emailAddress, 'feed');
                this.setState({ emailAddress: authenticationProfile.emailAddress, feedAuthorization: authorized });
            }
        }


        this.setState({ alert: alert, isLoggedIn: isLoggedIn, status: 'mounted' });
    }

    render() {
        if (this.state.status !== 'mounted') {
            return (<Loader />);
        }

        if (this.state.isLoggedIn === true && this.state.feedAuthorization === true) {
            return (
                <Layout location={location}>
                    <Helmet title="Login" />
                    <div className="container main-content">
                        <div style={getBannerStyle(this.state.environment)}>
                            <h2>{this.state.alert}</h2>
                        </div>
                        <div className="columns has-text-centered">
                            <div className="column">
                                <div>
                                    <a href="/app/feed" className="button is-large button-is-primary">
                                        Check out the feed</a>
                                </div>
                            </div>

                        </div>
                    </div>
                </Layout>
            )
        } else {
            return (
                <Layout location={location}>
                    <div className="main-content">
                        <div>Hello, we have not yet authorized you for any apps</div>
                        <LoadableAuthForm />
                    </div>
                </Layout>
            );
        }
    }
}

export default LoginIndex
