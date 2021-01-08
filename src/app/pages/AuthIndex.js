import React from 'react'
import get from 'lodash/get'
import Helmet from 'react-helmet'
import Layout from '../../components/layout'
import { LoadableCliqueViewer } from '../client_library'
import Loader from '../../components/Loader';

import ConfigService from '../ConfigService'
import AuthService from '../client/services/AuthService'

class AuthIndex extends React.Component {
    constructor(props) {
        super(props);
        // console.log(`path: ${props.path}`);
        this.state = {
            authService: new AuthService(),
            status: "initialized"
        }
    }
    async componentDidMount() {
        
        if(window.location.search.length > 0){
            this.state.authService.loginMagic();
        } else {
            console.log(window.location.search);
        }
        this.setState({status:'mounted'});
    }

    render() {
        debugger;
        const siteTitle = "Auth";
        let cfg = new ConfigService();
        const environment = cfg.get_environment();
        let bannerStyle = {
            position: 'absolute', top: '0px', left: '0px', marginTop: '70px',
            background: "red", width: '100%', textAlign: 'center', color: 'white'
        };
        if (environment === 'production') {
            bannerStyle.background = 'green';
        }

        if (this.state.status == 'initialized') {
            return (
                <Layout location={location}>
                    <div className="main-content">
                        <Loader />
                    </div>
                </Layout>
            );
        }

        return (
            <Layout location={location}>
                <div className="main-content" style={bannerStyle}>{environment}</div>
                <Helmet title={siteTitle} />
                <div className="container main-content">
                    <h1 style={{ textAlign: "center", paddingBottom: "1vh" }}>Welcome to Auth</h1>
                    <div className="container">
                        {this.state.alert}
                    </div>
                </div>
            </Layout>
        )
    }
}

export default AuthIndex
