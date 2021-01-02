import React, { Component } from "react"
import PropTypes from "prop-types"
import { Magic } from 'magic-sdk';

class AuthForm extends Component {
  
  constructor(props) {
    super(props);    
    const apiKey = 'pk_test_05CC9C10E2A6DA8C';
    
    this.state = {
      date: new Date(),
      email: "", 
      isLoggedIn: false,
      currentState: "",
      magic: new Magic(apiKey)
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleLogin = this.handleLogin.bind(this);
  }

  async isLoggedIn() {
    const isLoggedIn = await this.state.magic.user.isLoggedIn();
    return isLoggedIn;
  }

  async componentDidMount(){
    const isLoggedIn = await this.isLoggedIn();
    if (isLoggedIn){
      const idToken = await this.state.magic.user.getIdToken();
      

      this.setState({isLoggedIn: isLoggedIn, idToken: idToken});

    } else {
      this.setState({isLoggedIn: isLoggedIn});    
    }
  }

  handleChange(event) {
    this.setState({email: event.target.value});
  }

  isValidEmail(emailText) {
    return true;
  }

  async handleLogin(e) {
    e.preventDefault();
    if(this.isValidEmail(this.state.email)){
      /* One-liner login 🤯 */
      // The reference implementation is wrong

      let redirectURI = window.location.protocol 
      + "//" 
      + window.location.host + "/feed";

      this.setState({currentState: "Starting auth process..."});

      await this.state.magic.auth.loginWithMagicLink(
        { email: this.state.email, 
          showUI: true,
          redirectURI: redirectURI 
        }
      );
    }
  };

  render() {
    let label = "Check out pics of our family!";

    if (this.state.isLoggedIn){
      label = "Welcome back!";
    }

  return (<div>
    <h1>{label}</h1>
    <br/><br/>
    <p>Add yourself to the waitlist to check out the latest updates!</p>
    <div>{this.state.currentState}</div>
        <form>
          <input value={this.state.email} onChange={this.handleChange} className="input" type="email" name="email" 
          required="required" placeholder="Enter your email" />
          <br/><br/>
          <button onClick={this.handleLogin} className="button is-light pull-right" type="submit">
            Register
          </button>
        </form>
  </div>);
 }
};


export default AuthForm
