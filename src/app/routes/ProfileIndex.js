import React from 'react'
import get from 'lodash/get'

import Layout from '../../components/layout'
import Loader from '../../components/Loader'
import Logger from '../Logger';
import UserStore from '../repository/UserStore'
import AccountProfileService from '../services/AccountProfileService';
import AuthenticationProfile from '../models/AuthenticationProfile';
import MagicProfileComponent from '../client_components/profile/MagicProfileComponent';
import AccountProfile from '../models/AccountProfile';

class ProfileIndex extends React.Component {

    constructor(props) {
        /* props.authService, props.userSession */
        super(props);
 
        this.state = {
            alert: "", status: "initialized",
            isAuthorized: false, synced: false,
            accountProfile: props.userSession.accountProfile,
            authenticationProfile: props.userSession.authenticationProfile,
            accountProfileService: new AccountProfileService(),            
        };

        this.handleLogout = this.handleLogout.bind(this);
        this.handleSave = this.handleSave.bind(this);
        this.handleCreateProfile = this.handleCreateProfile.bind(this);
        let self = this;
        UserStore.onUpdate(function (model) {
            // this may not be reproducible, since emailAddress state is not always updated
            self.refreshAuthorization()
        });
    }

    async handleCreateProfile() {        
        this.state.accountProfileService.createProfile(this.state.authenticationProfile);
    }

    async handleSave() {
        alert("this no longer makese sense to update email.  need other attributes");        
    }

    getProfileSyncState() {
        // Magic Email could be different from local profile
        if (this.props.userSession === null || this.state.authenticationProfile === null) {
            this.setState({alert: "Your profile is not complete!"});
            return false;
        } 
        
        // check syncing of authenticationProfile email and accountProfile email
        if (this.state.authenticationProfile.emailAddress !== this.props.userSession.emailAddress) {
            this.setState({alert: "Email Addresses do not match"});

            return false;
        }
        
        Logger.info("Should be true now");
        return true;
    }

    async handleLogout() {
        this.props.authService.logout();
        this.setState({ alert: "You have been logged out" });
        console.log("redirect?");
    }

    async refreshAuthorization() {
        // TODO: Run on handle sync update
        
        const isAuthorized = await this.state.accountProfileService.getAuthorizationStatus(
            this.state.authenticationProfile.emailAddress, 'feed');
        this.setState({ isAuthorized: isAuthorized });
    }
    
    async componentDidMount() {
        try {
            let authenticationProfile = await this.props.authService.getAuthenticationProfile();
            if (authenticationProfile !== null) {
                let accountProfile = await this.state.accountProfileService.fetchMyProfile();

                this.setState({
                    accountProfile: accountProfile,    
                    authenticationProfile: authenticationProfile    
                });

                await this.refreshAuthorization();
            }
            const synced = this.getProfileSyncState()
            if (!synced) {
                this.setState({ alert: "Please sync your profile!" });
            }

            this.setState({ synced: synced });
        } catch (error) {
            console.error(`Challenges getting profile`, error);
        }
        this.setState({ status: 'mounted' });
    }

    renderAlert(alert) {
        if (this.state.alert === '' && alert === '') {
            return (<div></div>);
        }

        return (
            <div style={{ minHeight: "40px", minWidth: "40vw" }}>
                <div className="alert-message">
                    {alert}
                    <br />
                    {this.state.alert}
                </div>
            </div>);
    }

    renderSync() {
        return (<div style={{ margin: "30px 0px" }}>
            <div>
                <div className="field">
                    <label className="label">Profile State: {(this.state.synced) ? "" : "Not synced"}</label>
                </div>
            </div>
        </div>);
    }

    renderActions() {
        return (<div className="columns is-centered">
            <div className="column is-half">
                <div className="box">
                    <h2>Actions</h2>
                    <section className="profile-actions">
                        <br />
                        <div className="field">
                            <button onClick={this.handleLogout} className="button button-primary is-pulled-right">Logout</button>
                        </div>
                        <br />
                    </section>
                </div>
            </div>
        </div>);
    }

    render() {
        const location = get(this, 'props.location');        
        let alert = "";

        if (this.state.status !== 'mounted') {
            return (<Loader />);
        }
        return (
            <Layout location={location}>
                <section>
                    <div className="columns is-centered is-multiline">
                        <div className="column is-full">
                            <div className="is-pulled-right">
                                {this.renderAlert(alert)}
                            </div>
                            <h1>My Profile</h1>
                        </div>
                        <div id="profile-settings" className="column">

                            <div className="box">
                                <h2>My Account</h2>
                                <div id="account-actions" className="field is-pulled-right" >
                                    <div className="control has-icons-left">
                                        <button onClick={this.handleCreateProfile} className={(this.state.synced) ? "button is-pulled-right is-primary" : "button is-pulled-right is-danger"}>
                                            Create Account
                                        </button>
                                    </div>
                                </div>
                                <MagicProfileComponent 
                                emailAddress={this.state.authenticationProfile.emailAddress}
                                publicAddress={this.state.authenticationProfile.publicAddress}
                                didToken={this.state.authenticationProfile.didToken}
                                 />                                
                            </div>
                            <div className="box">
                                <div className="field">
                                    <button onClick={this.handleSave} className={(this.state.synced) ? "button is-pulled-right is-primary" : "button is-pulled-right is-danger"}>
                                        Update Profile
                                            </button>

                                    <h2>Profile Settings</h2>
                                </div>

                                <div>
                                    <h3>Settings</h3>
                                    <label>Email</label>
                                    <p>{this.state.authenticationProfile.emailAddress}</p>
                                </div>
                                <div>
                                    {this.renderSync()}
                                </div>
                                <div className="field">
                                    <label className="label">Authorization Status</label>

                                    <div className="control">
                                        <label className="checkbox" disabled>
                                            <input type="checkbox" checked={(this.state.isAuthorized ? 'checked' : '')} disabled />
                                            <span>Authorized</span>
                                        </label>
                                    </div>
                                </div>
                            </div>

                        </div>

                    </div>
                    {this.renderActions()}
                </section>
            </Layout>
        )
    }
}

export default ProfileIndex

