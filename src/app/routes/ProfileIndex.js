import React from 'react'
import get from 'lodash/get'

import Layout from '../../components/layout'
import Loader from '../../components/Loader'
import Logger from '../Logger';
import UserModel from '../models/UserModel'
import AccountProfileService from '../services/AccountProfileService';

class ProfileIndex extends React.Component {

    constructor(props) {
        super(props);
        Logger.info("Profile Index", props);
        /* props.authService, props.userModel */
        this.state = {
            alert: "",
            status: "initialized",
            isAuthorized: false,
            publicAddress: "",
            synced: false,
            accessToken: '',
            accountProfileService: new AccountProfileService(),
            profile: null,
            emailAddress: "" /* coalesce of internal and magic profile */
        };
        this.handleLogout = this.handleLogout.bind(this);
        this.handleSave = this.handleSave.bind(this);
        let self = this;
        UserModel.onUpdate(function (userModel) {
            // this may not be reproducible, since emailAddress state is not always updated
            self.getAuthorizationAsync(self.state.emailAddress, 'feed');
        });
    }

    async handleSave() {
        Logger.info("Updating userModel email", this.state.emailAddress);
        this.props.userModel.updateEmail(this.state.emailAddress);
    }

    getProfileSyncState() {
        // Magic Email could be different from local profile
        Logger.info("Profile", this.props.userModel);
        if (this.props.userModel === null) {
            return false;
        } else {
            if (this.state.emailAddress !== this.props.userModel.emailAddress) {
                return false;
            } else {
                if(this.state.profile.emailAddress !== this.props.userModel.emailAddress){
                    return false;
                }
                Logger.info("Should be true now");
                return true;
            }
        }
    }

    async handleLogout() {
        this.props.authService.logout();
        this.setState({ alert: "You have been logged out" });
        console.log("redirect?");
    }

    async getAuthorizationAsync() {
        // TODO: Run on handle sync update
        const isAuthorized = await this.props.authService.getAuthorizationStatus(this.state.emailAddress, 'feed');
        Logger.info(`ProfileIndex.Authorization::feed: ${this.emailAddress}`, isAuthorized);
        this.setState({ isAuthorized: isAuthorized });
    }

    async componentDidMount() {
        try {
            let authenticationProfile = await this.props.authService.getAuthenticationProfile();
            if (authenticationProfile !== null) {
                let profile = await this.state.accountProfileService.fetchUserProfile();

                this.setState({
                    profile: profile,
                    publicAddress: authenticationProfile.publicAddress,
                    emailAddress: authenticationProfile.emailAddress
                });


                this.getAuthorizationAsync();


            } else {
                Logger.info("Profile Index could not fetch Authentication Profile.  Setting to null");
            }
            let synced = this.getProfileSyncState()
            if (!synced) {
                this.setState({ alert: "Please sync your profile!" });
            }

            this.setState({ synced: synced });
        } catch (error) {
            console.error(`Challenges getting profile`, error);
        }
        this.setState({ status: 'mounted' });
    }

    async checkSyncState() {
        let synced = this.getProfileSyncState()

        if (synced === false) {
            this.setState({ alert: "Your profile is still not been synced yet.", synced: synced });
        } else {
            let alert = "Your profile has been sync'ed";
            this.setState({ synced: synced, alert: alert });
        }
    }

    renderAlert(alert) {

        if (this.state.alert === '' && alert === '') {
            return (<div></div>);
        }

        return (
            <div>
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

    render() {
        const location = get(this, 'props.location');

        let synced = this.getProfileSyncState()
        let alert = ""
        if (synced === false) {
            alert = "Your profile has not been synced yet."
        }


        if (this.state.status !== 'mounted') {
            return (<Loader />);
        } else {
            return (
                <Layout location={location}>
                    <section className="main-content">
                        <div className="columns is-centered">
                            <div className="column is-half">
                                <h1 className="has-text-centered" style={{ paddingBottom: "3vh" }}>My Profile</h1>
                                <section className="container profile-settings">
                                    <div style={{ minHeight: "40px" }}>
                                        {this.renderAlert(alert)}
                                    </div>

                                    <div className="box">
                                        <h2>My Account</h2>
                                        <div id="email-control" className="field">
                                            <label className="label">Email</label>
                                            <div className="control has-icons-left">
                                                <input readOnly="readonly" value={this.state.emailAddress} className="input " type="email" name="email"
                                                    required="required" placeholder="your@email.com" />
                                                <span className="icon is-small is-left">
                                                    <i className="fas fa-envelope"></i>
                                                </span>
                                            </div>
                                        </div>
                                        <div id="public-address-control" className="field">
                                            <label className="label">Public Address</label>
                                            <div className="control has-icons-left">
                                                <input readOnly="readonly" value={this.state.publicAddress}
                                                    className="input " name="publicAddress"
                                                    required="required" />
                                                <span className="icon is-small is-left">
                                                    <i className="fas fa-lock"></i>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="box">
                                        <div className="field">
                                            <button onClick={this.handleSave} className={ (this.state.synced) ? "button is-pulled-right is-primary" : "button is-pulled-right is-danger"}>
                                                Update Profile
                                            </button>

                                            <h2>Profile Settings</h2>
                                        </div>

                                        <div>
                                            <h3>Settings</h3>
                                            <label>Email</label>
                                            <p>{this.state.profile.emailAddress}</p>
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

                                </section>
                            </div>
                        </div>
                        <div className="columns is-centered">
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
                        </div>
                    </section>
                </Layout>
            )
        }
    }
}

export default ProfileIndex

