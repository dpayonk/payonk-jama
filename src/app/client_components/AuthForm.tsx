import React from "react"
import { Logger } from 'payonkjs';
import Loader from '../Loader';
import AuthService from '../services/AuthService'
import AccountProfileService from "../services/AccountProfileService";
import AuthenticationProfile from "../magic/AuthenticationProfile";

type ProfileProps = {
  onLogin: any
  // Example way to explicitly define input into component, great for documentation
}

type ProfileState = {
  alert: string
  isAuthorized: boolean
  status: string
  emailInput: string
  fetchedAuthorization: boolean
  fetchedLogin: boolean
  isLoggedIn: boolean
  authenticationProfile: AuthenticationProfile,
}

// class ProfileIndex extends React.Component<ProfileProps, ProfileState> {

class AuthForm extends React.Component<ProfileProps, ProfileState> {
  authService: AuthService;
  accountService: AccountProfileService;

  constructor(props) {
    // props should have an eventHandler to call when 
    // user has loggedIn or logged out
    super(props);

    this.state = {
      alert: "",
      emailInput: "",
      fetchedAuthorization: false, isAuthorized: false,
      fetchedLogin: false, isLoggedIn: false,
      authenticationProfile: null,
      status: "initialized",
    };

    this.authService = AuthService.getInstance();
    this.accountService = AccountProfileService.getInstance();

    this.handleChange = this.handleChange.bind(this);
    this.handleRegistration = this.handleRegistration.bind(this);
  }

  async componentDidMount() {
    await this.fetchLogin();

    let completed = await this.setAuthorizationProfile();
    if (completed === false) {
      this.setState({ alert: "Sorry, there was a server problem." });
    } else {

      if (this.state.authenticationProfile !== null) {
        // This is too complex combiniing a profile with magic link, need better model
        if (this.state.isAuthorized === true) {
          let emailInput = this.state.authenticationProfile.emailAddress;
          this.setState({ emailInput: emailInput });
        }
      } else {
        this.setState({ alert: "Your profile could not be fetched" });
      }
    }

    this.setState({ status: 'mounted' });
  }

  async fetchLogin() {
    if (this.state.fetchedLogin === false) {
      const isLoggedIn = await this.authService.isLoggedIn();
      this.setState({ isLoggedIn: isLoggedIn, fetchedLogin: true });
      return isLoggedIn;
    } else {
      return this.state.isLoggedIn;       // fetch from cache
    }
  }

  async setAuthorizationProfile() {
    let isAuthorized = false;
    let isOnline = await this.accountService.getHealth();

    if (isOnline !== true) {
      this.setState({ isAuthorized: false });
      return false;
    }

    let authenticationProfile = await this.authService.getAuthenticationProfile();
    if (authenticationProfile !== null) {
      isAuthorized = await this.accountService.fetchAuthorizationStatus(authenticationProfile.emailAddress, 'public');
      this.setState({
        authenticationProfile: authenticationProfile,
      });
    }

    this.setState({ isAuthorized: isAuthorized, fetchedAuthorization: true });
    debugger;
    return true;
  }

  isValidEmail(emailText) {
    return true;
  }

  handleChange(event) {
    this.setState({ emailInput: event.target.value });
  }

  async handleRegistration(e) {
    e.preventDefault();
    if (this.isValidEmail(this.state.emailInput)) {
      this.setState({ alert: "Check your email to login!" });
      let didToken = await this.authService.loginMagic(this.state.emailInput);

      if (this.props.onLogin !== undefined) {
        this.props.onLogin(this.state.emailInput, didToken);
      } else {
        Logger.alert("There is no event handler defined for auth form", null);
        Logger.info("Please implement a login handler function to set up downstratem profile process.", null);
      }
    }
  };

  renderUnauthorized() {
    debugger;
    let email = (this.state.authenticationProfile !== null) ? this.state.authenticationProfile.emailAddress : "";
    if (email === "") {
      return (<div>
        <p style={{ fontSize: "1.4rem", textIndent: "10px", maxWidth: "600px" }}>
          {this.state.alert}
        </p>
      </div>
      )
    }
    return (
      <div>
        <p style={{ fontSize: "1.4rem", textIndent: "10px", maxWidth: "600px" }}>
          {this.state.alert}
          We don't have you on file yet.
          <br /><br />
          Give us a few minutes to authorize you.
          If you're impatient, send us a message.
            </p>
      </div>
    )
  }

  render() {

    if (this.state.status !== 'mounted') {
      return (<Loader title="..." />);
    }

    if (this.state.isLoggedIn === true && this.state.isAuthorized === false) {
      return this.renderUnauthorized();
    }

    if (this.state.isLoggedIn && this.state.isAuthorized) {
      return (<div className="container" style={{ minHeight: "150px", marginBottom: "5vh" }}>
        <label style={{ fontSize: "1.3rem", fontWeight: "700", paddingBottom: "10px" }}>
          {this.state.alert}
        </label>
        <div><p style={{ textIndent: "20px" }}>
          Check out the <a className="" href="/app"> private feed</a> for new pics!
            </p>
        </div>
      </div>);
    }

    return (<div>
      <form>
        <div className="field">
          <label className="label">Email</label>
          <div className="control has-icons-left">
            <input style={{ maxWidth: "400px" }} value={this.state.emailInput} onChange={this.handleChange} className="input " type="email" name="email"
              required="required" placeholder="your@email.com" />
            <span className="icon is-small is-left">
              <i className="fas fa-envelope"></i>
            </span>
          </div>

        </div>
        <div className="field is-grouped">
          <div className="control">
            <div className="field">
              <button onClick={this.handleRegistration} className="button is-light is-pull-right" type="submit">
                Register
          </button>
            </div>
          </div>
        </div>
      </form>
    </div>
    )
  }
};


export default AuthForm
