import React from 'react'
import Helmet from 'react-helmet'
import Layout from '../../components/layout'
import Loader from '../../components/Loader';
import ConfigService from '../ConfigService';
import { LoadableAuthForm } from '../client_library';
import { getBannerStyle } from '../styleBuilder';
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
                                <div className="has-text-centered">
                                    <a style={{ height: "150px", width: "150px" }} href="/app/feed" className="button is-primary is-large">
                                        <span className="icon">
                                            <i style={{ display: 'block', fontSize: '3rem' }} className="fas fa-image"></i>
                                        </span>
                                    </a>
                                    <div>Our Feed</div>
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
                        <div className="columns is-centered">
                            <div className="column is-half">
                                <h1>Hello</h1>
                                <p>We could authorize you for any apps yet.</p>
                                <LoadableAuthForm />
                            </div>
                        </div>
                    </div>
                </Layout>
            );
        }
    }
}

export default LoginIndex
