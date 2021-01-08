import React, { Component } from "react"
import PropTypes from "prop-types"
import AuthService from './services/AuthService'

import Loader from '../../components/Loader';
import ConfigService from '../ConfigService';

class AuthForm extends Component {

  constructor(props) {
    super(props);

    this.state = {
      email: "",
      isLoggedIn: false,
      isAuthorized: false,
      currentState: "initialized",
      alert: "",
      authService: new AuthService()
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleLogin = this.handleLogin.bind(this);
  }

  async isLoggedIn() {
    const isLoggedIn = await this.state.authService.isLoggedIn();
    return isLoggedIn;
  }

  async componentDidMount() {
    const isLoggedIn = await this.isLoggedIn();

    if (isLoggedIn) {
      const profile = await this.state.authService.getProfile();
      let isAuthorized = false;
      if (profile !== null) {
        if (!isAuthorized) {
          this.setState({ email: profile.email });
          this.setState({ alert: `Sorry, ${this.getFriendlyName()}! You have not been approved yet.` });
        }
        isAuthorized = profile.isAuthorized;
      } else {
        this.setState({ alert: "Your profile could not be fetched" });
      }
      this.setState({ isLoggedIn: isLoggedIn, isAuthorized: isAuthorized, profile: profile });
    } else {

      this.setState({ isLoggedIn: isLoggedIn });
    }
    this.setState({ currentState: 'mounted' });
  }

  handleChange(event) {
    this.setState({ email: event.target.value });
  }

  isValidEmail(emailText) {
    return true;
  }

  async handleLogin(e) {
    e.preventDefault();
    if (this.isValidEmail(this.state.email)) {
      this.setState({ currentState: "Starting auth process..." });

      await this.state.authService.loginMagic(this.state.email);

    }
  };

  getFriendlyName() {
    const emailParts = this.state.email.split("@");
    return emailParts[0];
  }

  render() {
    let label = "Check out updates of our family!";
    let description = (<p>Register for the waitlist to check out the latest updates!</p>);

    if (this.state.currentState !== 'mounted') {
      return (
        <div style={{ minHeight: "10vh", textAlign: "center" }}>
          <Loader />
        </div>);
    }

    if (this.state.isLoggedIn) {
      label = `Welcome!`;
      if (this.state.isAuthorized) {
        description = (<div>
          <p style={{ textIndent: "20px" }}>
            Check out the <a className="" href="/app"> private feed</a> for new pics!
            </p>
        </div>);
      } else {
        label = this.state.alert
        description = (<div>
          <p style={{ textIndent: "20px" }}>
            We don't have your email address on file yet.  Give us a few minutes to authorize you.
            If you're impatient, send us a message.
            </p>
        </div>);
      }
    }

    if (!this.state.isLoggedIn) {
      description = (<form>
        <div className="field">
          <label className="label">Email</label>
          <div className="control has-icons-left">
            <input value={this.state.email} onChange={this.handleChange} className="input " type="email" name="email"
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
      );
    }
    return (
      <div className="container" style={{ minHeight: "150px", marginBottom: "5vh" }}>
        <label style={{fontSize: "2rem", fontWeight: "700", paddingBottom: "10px"}}>{label}</label>
        <div>{description}</div>
      </div>);
  }
};


export default AuthForm
