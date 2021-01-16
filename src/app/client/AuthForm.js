import React, { Component } from "react"
import AuthService from '../services/AuthService'
import Loader from '../../components/Loader';
import Logger from "../Logger";

class AuthForm extends Component {

  constructor(props) {
    super(props);

    this.state = {
      alert: "",
      authService: new AuthService(),
      emailInput: "",
      fetchedAuthorization: false, isAuthorized: false,
      fetchedLogin: false, isLoggedIn: false,
      status: "initialized",
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleLogin = this.handleLogin.bind(this);
  }

  async fetchLogin() {
    if (this.state.fetchedLogin === false) {
      const isLoggedIn = await this.state.authService.isLoggedIn();
      this.setState({ isLoggedIn: isLoggedIn, fetchedLogin: true });
      return isLoggedIn;
    } else {
      return this.state.isLoggedIn;       // fetch from cache
    }
  }

  isValidEmail(emailText) {
    return true;
  }

  getFriendlyName() {
    const emailParts = this.state.emailInput.split("@");
    return emailParts[0];
  }

  async isAuthorized() {
    if (this.state.fetchedAuthorization === false) {
      await this.fetchAuthorizationProfile(); // authorization status set by getting profile
      return this.state.isAuthorized;
    } else {
      return this.state.isAuthorized;       // fetch from cache
    }
  }

  async fetchAuthorizationProfile() {
    let authenticationProfile = await this.state.authService.getAuthenticationProfile();
    Logger.info(`Profile response: `, authenticationProfile);
    if (authenticationProfile === null) {
      this.setState({ isAuthorized: false, fetchedAuthorization: true });
    } else {
      // I could say this is a alid profile
      let authorizationStatus = await this.state.authService.getAuthorizationStatus(authenticationProfile.emailAddress);
      this.setState({
        isAuthorized: authorizationStatus,
        authenticationProfile: authenticationProfile,
        fetchedAuthorization: true
      });
    }
  }

  async componentDidMount() {
    await this.fetchLogin();
    await this.fetchAuthorizationProfile();

    if (this.state.authenticationProfile !== null) {
      // This is too complex combiniing a profile with magic link, need better model
      if (this.state.isAuthorized == true) {
        this.setState({ emailInput: this.state.authenticationProfile.emailAddress });
        if (this.state.isAuthorized) {
          this.setState({ alert: `Hi ${this.getFriendlyName()}!` });
        } else {
          this.setState({ alert: `Sorry, ${this.getFriendlyName()}! You have not been approved yet.` });
        }
      }
    } else {
      this.setState({ alert: "Your profile could not be fetched" });
    }
    this.setState({ status: 'mounted' });
  }

  handleChange(event) {
    this.setState({ emailInput: event.target.value });
  }

  async handleLogin(e) {
    e.preventDefault();
    if (this.isValidEmail(this.state.emailInput)) {
      this.setState({ alert: "Starting auth process, setting email..." });
      await this.state.authService.loginMagic(this.state.emailInput);
    }
  };

  render() {

    if (this.state.status !== 'mounted') {
      return (<Loader title="..." />);
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
    } else if (this.state.isLoggedIn === true && this.state.isAuthorized === false) {
      return this.renderUnauthorized();
    } else {
      return this.renderLoginForm();
    }
  }

  renderUnauthorized() {
    let email = this.state.authenticationProfile.emailAddress;
    return (
      <div>
        <p style={{ textIndent: "20px" }}>
          We don't have your email address ({email}) on file yet.  Give us a few minutes to authorize you.
          If you're impatient, send us a message.
            </p>
      </div>
    )
  }

  renderLoginForm() {
    return (<div>
      <p>Register for the waitlist for the latest updates!</p>

      <form>
        <div className="field">
          <label className="label">Email</label>
          <div className="control has-icons-left">
            <input value={this.state.emailInput} onChange={this.handleChange} className="input " type="email" name="email"
              required="required" placeholder="your@email.com" />
            <span className="icon is-small is-left">
              <i className="fas fa-envelope"></i>
            </span>
          </div>

        </div>
        <div className="field is-grouped">
          <div className="control">
            <div className="field">
              <button onClick={this.handleLogin} className="button is-light is-pull-right" type="submit">
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
