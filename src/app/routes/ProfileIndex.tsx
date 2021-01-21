import React from 'react'
import get from 'lodash/get'
import Layout from '../../components/layout'
import Loader from '../../components/Loader'
import Logger from '../Logger'
import UserStore from '../repository/UserStore'
import AccountProfileService from '../services/AccountProfileService'
import AuthenticationProfile from '../magic/AuthenticationProfile'
import MagicProfileComponent from '../magic/MagicProfileComponent'
import AccountProfile from '../models/AccountProfile'
import UserSession from '../models/UserSession'
import AuthService from '../services/AuthService'

type ProfileProps = {
//  userSession: UserSession
}

type ProfileState = {
  alert: string
  isAuthorized: boolean
  synced: boolean
  jwtToken: string
  status: string
  accountProfile: AccountProfile
  authenticationProfile: AuthenticationProfile
}

class ProfileIndex extends React.Component<ProfileProps, ProfileState> {
  accountProfileService: AccountProfileService
  authService: AuthService

  constructor(props: ProfileProps) {
    super(props);
    this.accountProfileService = AccountProfileService.getInstance();
    this.authService = AuthService.getInstance();

    //     let accountProfile = this.accountProfileService.
    this.state = {
      alert: '',
      status: 'initialized',
      isAuthorized: false,
      synced: false,
      jwtToken: UserStore.getJWT(),
      authenticationProfile: null, // authenticationProfile
      accountProfile: null //accountProfile (set up on componentDidMount)
    }
    
    this.handleCreateProfile = this.handleCreateProfile.bind(this)
    let self = this
    UserStore.onUpdate(function(model) {
      // this may not be reproducible, since emailAddress state is not always updated
      self.refreshAuthorization()
    })
  }

  async componentDidMount() {
    try {
      let authenticationProfile = await this.authService.getAuthenticationProfile();

      if (authenticationProfile !== null && this.state.jwtToken !== null) {
        let accountProfile = await this.accountProfileService.fetchMyProfile(
          authenticationProfile
        )
        Logger.warn(
          'Should we update the accountProfile of parent?',
          accountProfile
        )
        this.setState({ accountProfile: accountProfile })
      } else if (this.state.jwtToken === null){
        this.setState({
          alert: 'There is no session set up on this browser. Please create a session',
        })

      } else {
        this.setState({
          alert: 'Your authentication profile could not be retrieved',
        })
      }

      this.setState({
        synced: this.getProfileSyncState(),
        authenticationProfile: authenticationProfile,
      })
    } catch (error) {
      console.error(
        `ProfileIndex.componentDidMount: Exception fetching profile`,
        error
      )
    }

    this.setState({ status: 'mounted' })
  }


  async handleCreateProfile() {
    let emailToUse = this.state.authenticationProfile.emailAddress
    let didTokenToUse = this.state.authenticationProfile.didToken
    if (this.state.authenticationProfile.didToken !== null) {
      Logger.debug(
        `Creating session with ${emailToUse} and ${didTokenToUse} `,
        didTokenToUse
      )
      let resultMessage = await this.accountProfileService.createProfile(
        this.state.authenticationProfile
      )
      Logger.warn(
        'Should we update the accountProfile of parent?',
        resultMessage
      )
    } else {
      Logger.warn(
        `The user has not been authenticated yet. No did token present`,
        emailToUse
      )
      this.setState({ alert: 'Check to make sure you are authenticated' })
    }
  }

  getProfileSyncState() {
    // Compares email addresses for authentication (magic) and account (internal) profiles
    // Magic Email could be different from local profile
    if (this.state.authenticationProfile === null) {
      this.setState({ alert: 'Your profile is not complete!' })
      return false
    }

    // check syncing of authenticationProfile email and accountProfile email
    if (
      this.state.authenticationProfile.emailAddress !==
      this.state.accountProfile.emailAddress
    ) {
      this.setState({ alert: 'Email Addresses do not match' })

      return false
    }

    return true
  }

  async refreshAuthorization() {
    // TODO: Run on handle sync update

    const isAuthorized = await this.accountProfileService.fetchAuthorizationStatus(
      this.state.authenticationProfile.emailAddress,
      'feed'
    )
    this.setState({ isAuthorized: isAuthorized })
  }

  renderAlert(alert) {
    if (this.state.alert === '' && alert === '') {
      return <div></div>
    }

    return (
      <div style={{ minHeight: '40px', minWidth: '40vw' }}>
        <div className="alert-message">
          {alert}
          <br />
          {this.state.alert}
        </div>
      </div>
    )
  }

  renderAccountProfile() {
    if (this.state.accountProfile === null) {
      return (
        <div className="box">
          <div style={{ paddingBottom: '20px' }} id="account-profile">
            <h2>My Account Profile</h2>
            <div>Your account profile could not be fetched</div>
            <div className="is-pulled-right">
              <button
                onClick={this.handleCreateProfile}
                className={
                  this.state.synced
                    ? 'button is-pulled-right is-primary'
                    : 'button is-pulled-right is-danger'
                }
              >
                Create Profile
              </button>
            </div>
          </div>
        </div>
      )
    }
    return (
      <div className="box">
        <h2>My Account Profile</h2>
        <div className="is-pulled-right">
          <button
            onClick={this.handleCreateProfile}
            className={
              this.state.synced
                ? 'button is-pulled-right is-primary'
                : 'button is-pulled-right is-danger'
            }
          >
            Refresh Session
          </button>
        </div>
        <div>
          <label className="label">Email</label>
          <div className="field">{this.state.accountProfile.emailAddress}</div>
        </div>
        <div>
          <div style={{ margin: '30px 0px' }}>
            <div>
              <div className="field">
                <label className="label">Profile State</label>
                <div className="control">
                  {this.state.synced ? 'Synchronized' : 'Not synced'}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="field">
          <label className="label">Role Status</label>
          <div className="control">
            <label className="checkbox">
              {this.state.accountProfile.currentRole}
            </label>
          </div>
        </div>
      </div>
    )
  }

  render() {
    const location = get(this, 'props.location')
    let jwtToken = UserStore.getJWT()

    if (this.state.status !== 'mounted') {
      return <Loader />
    }
    return (
      <Layout location={location}>
        <div className="columns is-centered is-multiline">
          <div id="profile-header" className="column is-full">
            <div className="is-pulled-right">{this.renderAlert('')}</div>
            <h1>My Profile</h1>
          </div>
          <div id="authentication-profile-settings" className="column is-half">
            <div className="box">
              <h2>My Authentication Settings</h2>
              <MagicProfileComponent
                emailAddress={this.state.authenticationProfile.emailAddress}
                publicAddress={this.state.authenticationProfile.publicAddress}
                didToken={this.state.authenticationProfile.didToken}
              />
            </div>
          </div>
          <div id="account-profile-settings" className="column is-half">
            {this.renderAccountProfile()}
          </div>
          <div id="account-local-settings" className="column is-half">
            <div className="box">
              <h3>Local Settings</h3>
              <div style={{ background: 'yellow', padding: '7px' }}>
                <label className="label">Session Access Token</label>
                <div className="field">{jwtToken}</div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    )
  }
}

export default ProfileIndex
