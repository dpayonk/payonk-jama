import React from 'react'
import { Link } from 'gatsby'
import get from 'lodash/get'
import Helmet from 'react-helmet'
import { graphql } from 'gatsby'

import Layout from '../../components/layout'
import AuthService from '../client/services/AuthService'

class ProfileIndex extends React.Component {

    constructor(props){
        super(props);

        this.state = {
            authService: new AuthService(),
            email: null,
            isAuthorized: false,
            publicAddress: ""
        };
        this.handleLogout = this.handleLogout.bind(this);
    }

    async handleLogout(){
        this.state.authService.logout();
        console.log("redirect?");
    }

    async componentDidMount(){
        let profile = await this.state.authService.getProfile();
        console.log("Profile");
        console.log(profile);
        if(profile !== null){
            this.setState({
                email: profile.email, 
                publicAddress: profile.publicAddress, 
                isAuthorized: profile.isAuthorized
            });    
        }
    }

    render() {
        const siteTitle = get(
        this,
        'props.data.cosmicjsSettings.metadata.site_title'
        )
        const location = get(this, 'props.location')


        return (
        <Layout location={location}>
            <section style={{marginTop: "20vh"}}>
            <h1 style={{paddingBottom: "3vh"}}>My Profile</h1>
            <div>
                <div>
                <label>Email</label>
                {this.state.email}
                </div>
                <div>
                <label>Authorized</label>
                {this.state.isAuthorized}

                </div>
                <div>
                    <button onClick={this.handleLogout} className="button button-primary">Logout</button>
                </div>
            </div>
            </section>        
        </Layout>
        )
  }
}

export default ProfileIndex

