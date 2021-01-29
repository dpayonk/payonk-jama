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
import AuthService from '../services/AuthService'
import LocalSettingsPartial from '../client_components/profile/LocalSettingsPartial'
import AccountProfilePartial from '../client_components/profile/AccountProfilePartial'

type ProfileProps = {
  // Example way to explicitly define input into component, great for documentation
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
    super(props)
    this.accountProfileService = AccountProfileService.getInstance();
    this.authService = AuthService.getInstance();

    this.state = {
      alert: '',
      status: 'initialized',
      isAuthorized: false,
      synced: false,
      jwtToken: UserStore.getJWT(),
      authenticationProfile: null, // initialized onCompomenentDidMount
      accountProfile: null, // initialized onCompomenentDidMount
    }

    this.handleCreateProfile = this.handleCreateProfile.bind(this)
    let self = this
    UserStore.onUpdate(function(model) {
      // this may not be reproducible, since emailAddress state is not always updated
      let refreshed = self.refreshAuthorization()
      Logger.alert(`You're session has been refreshed`, refreshed)
    })
  }

  async componentDidMount() {
    try {
      let authenticationProfile = await this.authService.getAuthenticationProfile();

      if (authenticationProfile !== null && this.state.jwtToken !== null) {
        let accountProfile = await this.accountProfileService.fetchMyProfile()
        Logger.warn(
          'Should we update the accountProfile of parent?',
          accountProfile
        )
        this.setState({ accountProfile: accountProfile })
      } else if (this.state.jwtToken === null) {
        Logger.alert(`You have been logged out.  Please refresh your session.`, this.state.jwtToken);
      } else {
        Logger.alert(`Your profile could not be retrieved.  Please refresh your session.`, this.state.jwtToken);
      }

      // https://stackoverflow.com/questions/33613728/what-happens-when-using-this-setstate-multiple-times-in-react-component
      this.setState({authenticationProfile: authenticationProfile}, () => {
        this.setState({synced: this.getProfileSyncState(),});
      });
    } catch (error) {
      console.error(
        `ProfileIndex.componentDidMount: Exception fetching profile`,
        error
      )
    }

    this.setState({ status: 'mounted' })
  }

  async handleCreateProfile() {
    // child components with state will rerender on any stateUpdate
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
    if (this.state.authenticationProfile === null) {
      this.setState({ alert: 'Your profile is not complete!' })
      return false;
    }
    if (this.state.accountProfile === null){
      this.setState({alert: 'Your acount profile is not set up'});
      return false;
    }

    if (
      this.state.authenticationProfile.emailAddress !==
      this.state.accountProfile.emailAddress
    ) {
      this.setState({ alert: 'Email Addresses do not match' })

      return false;
    }

    return true;
  }

  async refreshAuthorization(): Promise<boolean> {
    // TODO: Run on handle sync update
    try {
      const isAuthorized = await this.accountProfileService.fetchAuthorizationStatus(
        this.state.authenticationProfile.emailAddress,
        'feed'
      )
      this.setState({ isAuthorized: isAuthorized })
    } catch (exc) {
      return false;
    }
    return true;
  }

  renderAlert() {
    if (this.state.alert === '') {
      return null;
    }

    return (
      <div style={{ minHeight: '40px', minWidth: '40vw' }}>
        <div className="alert-message">
          {this.state.alert}
        </div>
      </div>
    )
  }

  render() {
    const location = get(this, 'props.location')    

    if (this.state.status !== 'mounted') {
      return <Loader />
    }
    return (
      <Layout location={location}>
        <div className="columns is-centered is-multiline">
          <div id="profile-header" className="column is-full">
            <div className="is-pulled-right">
              {this.renderAlert()}
            </div>
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
            <AccountProfilePartial 
            refreshProfileCallback={this.handleCreateProfile} accountProfile={this.state.accountProfile} />
          </div>
          <div id="account-local-settings" className="column is-half">
            <LocalSettingsPartial props={this.state.accountProfile} />
          </div>
        </div>
      </Layout>
    )
  }
}

export default ProfileIndex
