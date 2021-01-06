import React, { Component } from "react";
import { Magic } from 'magic-sdk';


class AuthService extends Component{
  constructor(props){
    super(props)
  }

  getMagicFactory(){
    const apiKey = 'pk_test_05CC9C10E2A6DA8C';
    return new Magic(apiKey);
  }

  async isLoggedIn(){      
      const isLoggedIn = await this.getMagicFactory().user.isLoggedIn();
      return isLoggedIn;
  }

  hasBeenHere(){
    return true;
  }

  async loginMagic(){
    await this.getMagicFactory().auth.loginWithMagicLink(        { email: this.state.email, 
      showUI: true,
      redirectURI: redirectURI 
    });
  }

  async getProfile() {
    if(await this.isLoggedIn()){
      // Assumes a user is already logged in
      try {

        const { email, publicAddress } = await this.getMagicFactory().user.getMetadata();
        console.log("No exctuion");
        return {email, publicAddress};
      } catch {
        console.error("An error was thrown");
        // Handle errors if required!
        return null;
      }
    } else {
      return null;
    }
  }
}

export default AuthService