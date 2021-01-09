import React from 'react'
import { Link } from 'gatsby'
import get from 'lodash/get'
import Helmet from 'react-helmet'
import { graphql } from 'gatsby'

import Layout from '../../components/layout'
import AuthService from '../client/services/AuthService'
import Loader from '../../components/Loader'

class ProfileIndex extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            authService: new AuthService(),
            email: null,
            isAuthorized: false,
            publicAddress: "",
            status: "initialized",
            alert: ""
        };
        this.handleLogout = this.handleLogout.bind(this);
    }

    async handleLogout() {
        this.state.authService.logout();
        this.setState({alert: "You have been logged out"});
        console.log("redirect?");
    }

    async componentDidMount() {
        let profile = await this.state.authService.getProfile();
        if (profile !== null) {
            this.setState({
                email: profile.email,
                publicAddress: profile.publicAddress,
                isAuthorized: profile.isAuthorized
            });

        } else {
            console.log("Profile is null");
        }
        this.setState({ status: 'mounted' });
    }

    renderAlert(){
        let background = (this.state.alert !== "" ? 'red' : 'grey');

        return (
            <div className="alert-message" style={{background: background, padding: "10px"}}>
                {this.state.alert}</div>);

    }

    renderComponent() {
        return (
            <div>
                <h1 style={{ paddingBottom: "3vh" }}>My Profile</h1>
                <div>
                    <div style={{minHeight: "40px"}}>
                        {this.renderAlert()}
                    </div>
                    <div id="email-control" className="field">
                        <label className="label">Email</label>
                        <div className="control has-icons-left">
                            <input readOnly="readonly" value={this.state.email} className="input " type="email" name="email"
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
            </div>
        )
    }

    render() {
        const location = get(this, 'props.location')
        console.log("Authorization Status: ");
        console.log(this.state.isAuthorized);

        let component = (<Loader />);
        if(this.state.status === 'mounted'){
            component = this.renderComponent()
        }

        return (
            <Layout location={location}>
                <section className="main-content">
                    {component}
                </section>
            </Layout>
        )
    }
}

export default ProfileIndex

