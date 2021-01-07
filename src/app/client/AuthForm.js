import React, { Component } from "react"
import PropTypes from "prop-types"
import AuthService from './services/AuthService'

import Loader from '../../components/Loader';
import ConfigService from '../ConfigService';

class AuthForm extends Component {
  
  constructor(props) {
    super(props);    
    
    this.state = {
      date: new Date(),
      email: "", 
      isLoggedIn: false,
      isAuthorized: false,
      currentState: "initialized",      
      authService: new AuthService()
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleLogin = this.handleLogin.bind(this);
  }

  async isLoggedIn() {
    const isLoggedIn = await this.state.authService.isLoggedIn();
    return isLoggedIn;
  }

  async componentDidMount(){
    const isLoggedIn = await this.isLoggedIn();

    if (isLoggedIn){
      const profile = await this.state.authService.getProfile();
      let isAuthorized = false;
      if(profile !== null){
        isAuthorized = profile.isAuthorized;
      }
      this.setState({isLoggedIn: isLoggedIn, isAuthorized: isAuthorized, profile: profile});
    } else {

        this.setState({isLoggedIn: isLoggedIn});    
    }
    this.setState({currentState: 'mounted'});
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
      this.setState({currentState: "Starting auth process..."});

      await this.state.authService.loginMagic(this.state.email);
      
    }
  };

  render() {
    let label = "Check out pics of our family!";
    let description = (<p>Add yourself to the waitlist to check out the latest updates!</p>);
    let form = "";

    if (this.state.currentState !== 'mounted'){
      return (
      <div style={{minHeight: "10vh"}}> 
      <Loader />
      </div>);
    }

    if (this.state.isLoggedIn){
      label = `Welcome!`;
      if(this.state.isAuthorized){
        description = (<div>
          <p style={{textIndent: "20px"}}>
            Check out the <a className="button is-ghost" href="/app"> private feed</a> for new pics
            </p>
        </div>);
      } else {
        description = (<div>
          <p style={{textIndent: "20px"}}>
            We don't have your email address on file yet.  Give us a few minutes to authorize you.
            If you're impatient, send us a message.
            </p>         
        </div>);
      }
    }

    if (!this.state.isLoggedIn){
      description = (<form>
        <input value={this.state.email} onChange={this.handleChange} className="input" type="email" name="email" 
        required="required" placeholder="Enter your email" />
        <br/><br/>
        <button onClick={this.handleLogin} className="button is-light pull-right" type="submit">
          Register
        </button>
      </form>
      );
    }
    return (<div style={{minHeight: "10vh", marginBottom: "5vh"}}>
      <h1>{label}</h1>
      <br/><br/>
      <div>{description}</div>      
    </div>);
 }
};


export default AuthForm
