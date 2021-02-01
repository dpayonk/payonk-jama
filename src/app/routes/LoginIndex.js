import React from 'react'
import Helmet from 'react-helmet'
import { Logger, UserRepository } from 'payonkjs';
import Layout from '../../components/layout'
import Loader from '../../components/Loader';
import ConfigService from '../ConfigService';
import { LoadableAuthForm } from '../client_library';
import { getBannerStyle } from '../styleBuilder';
import AuthService from '../services/AuthService';
import AccountProfileService from '../services/AccountProfileService';

/**
 * Landing page of where authentication and profile creation happen
 * 
 */
class LoginIndex extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            environment: ConfigService.getEnvironment(),
            status: "initialized",
            isLoggedIn: false,
            feedAuthorization: false,
            authenticationProfile: null,
            accountProfile: null,
            expiredLogin: false,
            alert: ""
        }
        this.profileService = AccountProfileService.getInstance();
        this.authService = AuthService.getInstance();
        this.authEventHandler = this.authEventHandler.bind(this);
        this.handleRefreshProfile = this.handleRefreshProfile.bind(this);
        this.handleLogout = this.handleLogout.bind(this);
    }

    async componentDidMount() {
        let alert = "";
        let isLoggedIn = await this.authService.isLoggedIn();
        if (isLoggedIn) {
            alert = `Welcome Back`;
            let authenticationProfile = await this.authService.getAuthenticationProfile();
            if (authenticationProfile !== null) {
                let authorized = await this.profileService.fetchAuthorizationStatus(authenticationProfile.emailAddress, 'feed');
                this.setState({ authenticationProfile: authenticationProfile, feedAuthorization: authorized });
            }
        }
        this.setState({ alert: alert, isLoggedIn: isLoggedIn, status: 'mounted' });
    }

    authEventHandler(emailAddress, didToken) {
        debugger;
        // This is the original screen, if you want to refresh the page
        // or send to a new page, this is where to do it.
        UserRepository.publishLogin(emailAddress, didToken);
    }

    async handleLogout() {
        let serviceResult = await this.authService.logout();
        this.setState({ alert: 'You have been logged out!', isLoggedIn: false });
    }

    async handleRefreshProfile() {
        if (this.state.authenticationProfile !== null) {
            try {
                let accountProfile = await this.profileService.createProfile(this.state.authenticationProfile);
                debugger;
                if (accountProfile !== null) {
                    if (this.props.onLoginCallback !== undefined) {
                        try{
                            this.props.onLoginCallback(accountProfile);
                        }catch(exc){
                            Logger.warn(`Callback to handle new profile threw an error`, this.props.onLoginCallback);
                        }
                    } else {
                        Logger.info(`No callback defined`);
                    }
                } else {
                    // may need to get errors here, could be outdated user, setting loginstate to false
                    this.setState({ isLoggedIn: account, expiredLogin: true });
                    this.setState({ alert: 'There was a problem fetching your account profile' });
                }
            } catch (exc) {
                debugger;
                this.setState({ alert: 'Service Exception occurred' });
            }

        } else {
            alert("Authentication Profile is null.  You're going to need to reauthenticate!");
        }
    }

    renderJWTWidget() {
        let jwtToken = UserRepository.getJWT();
        if (jwtToken === null || jwtToken === "") {
            return (
            <div className="has-text-centered" style={{ margin: "30px" }}>
                <div style={{ padding: "8px" }}>

                    <button onClick={this.handleRefreshProfile} className="button is-secondary">
                        Create Profile
                </button>
                </div>
                <div style={{ padding: "8px" }}>
                    <button className="button is-primary" onClick={this.handleLogout}>
                        Logout
                </button>
                </div>

            </div>);
        } else {
            return (<div>
                <small>This should not be called.  An error occurred</small>
                <button onClick={this.handleRefreshProfile} className="button is-secondary">
                    Refresh Session
                </button>
            </div>);
        }
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
        }

        if (this.state.isLoggedIn && this.state.accountProfile === null) {
            return (
                <Layout location={location}>
                    <div className="main-content">
                        <div className="columns is-centered">
                            <div>
                                <h2>{this.state.alert}</h2>

                                {this.renderJWTWidget()}
                            </div>
                        </div>
                    </div>
                </Layout>
            )
        }
        return (
            <Layout location={location}>
                <div className="main-content">
                    <div className="columns is-centered">
                        <div className="column is-half">
                            <h1>Hello</h1>
                            <p>You are not authorized for any apps right now.</p>
                            <LoadableAuthForm />
                        </div>
                    </div>
                </div>
            </Layout>
        );

    }
}

export default LoginIndex
