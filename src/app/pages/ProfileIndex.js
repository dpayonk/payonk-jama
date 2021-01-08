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
        if(profile !== null){
            this.setState({
                email: profile.email, 
                publicAddress: profile.publicAddress, 
                isAuthorized: profile.isAuthorized
            });    

        } else {
            console.log("Profile is null");
        }
    }

    render() {
        const location = get(this, 'props.location')
        console.log("Authorization Status: ");
        console.log(this.state.isAuthorized);

        return (
        <Layout location={location}>
            <section className="main-content">
            <h1 style={{paddingBottom: "3vh"}}>My Profile</h1>
            <div>
                <div id="email-control" className="field">
                    <label className="label">Email</label>
                    <div className="control has-icons-left">
                        <input readOnly="readonly" value={this.state.email} onChange={this.handleChange} className="input " type="email" name="email"
                        required="required" placeholder="your@email.com" />
                        <span className="icon is-small is-left">
                        <i className="fas fa-envelope"></i>
                        </span>
                    </div>

                </div>
                <div className="field">
                    <label className="label">Authorization Status</label>
                    <div className="control">
                        
                    </div>
                </div>
                <label className="checkbox" disabled>
                    <input type="checkbox" checked={(this.state.isAuthorized ? 'checked' : '')} disabled />
                    Authorized 
                </label>
                <div className="field">
                    <button onClick={this.handleLogout} className="button button-primary is-pulled-right">Logout</button>
                </div>
            </div>
            </section>        
        </Layout>
        )
  }
}

export default ProfileIndex

