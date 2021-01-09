import React from 'react'
import Helmet from 'react-helmet'
import Layout from '../../components/layout'
import Loader from '../../components/Loader';

import ConfigService from '../ConfigService'
import AuthService from '../client/services/AuthService'

class AuthIndex extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            authService: new AuthService(),
            status: "initialized",
            isLoggedIn: false,
            alert: ""
        }
    }
    async componentDidMount() {
        if (window.location.search.length > 0) {
            // Check if there is a magiclink in the query params
            console.log(`AuthIndex.mount TODO: need email`);
            // this.state.authService.loginMagic();
            this.setState({ alert: "Confirming your authentication status?  Try refreshing!" })
        } else {
            if (this.state.authService.isLoggedIn()) {
                this.setState({ isLoggedIn: true, alert: "Welcome Back" });
            }
        }
        this.setState({ status: 'mounted' });
    }

    render() {
        const environment = new ConfigService().get_environment();
        let bannerStyle = (environment === 'production') ? { background: 'green' } : { background: 'red' };

        if (this.state.status === 'initialized') {
            return (<Loader />);
        } else if (this.state.status == 'mounted' && this.state.isLoggedIn === true) {

            return (
                <Layout location={location}>
                    <div className="main-content dev-banner" style={bannerStyle}>
                        <h2>{this.state.alert}</h2>
                    </div>
                    <Helmet title="Login" />
                    <div className="container main-content">
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
                        <Loader />
                    </div>
                </Layout>
            );
        }
    }
}

export default AuthIndex
