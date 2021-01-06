import React, { Component } from "react";
import { Magic } from 'magic-sdk';
import ConfigService from '../../ConfigService';

class AuthService extends Component {
  constructor(props) {
    super(props)
    this.cfg = new ConfigService();
  }

  getMagicFactory() {    
    const apiKey = this.cfg.get_magic_key();
    return new Magic(apiKey);
  }

  async isLoggedIn() {
    const isLoggedIn = await this.getMagicFactory().user.isLoggedIn();
    return isLoggedIn;
  }

  hasBeenHere() {
    return true;
  }

  getRedirectUri() {
    const appUrl = this.cfg.getAppRoute();
    let redirectURI = window.location.protocol + "//" + window.location.host + appUrl;
    return redirectURI;
  }

  async loginMagic(email) {
    /* One-liner login 🤯 */
    // The reference implementation is wrong
    await this.getMagicFactory().auth.loginWithMagicLink({
      email: email,
      showUI: true,
      redirectURI: this.getRedirectUri()
    });
  }

  async getProfile() {
    if (await this.isLoggedIn()) {
      // Assumes a user is already logged in
      try {

        const { email, publicAddress } = await this.getMagicFactory().user.getMetadata();
        console.log("No exctuion");
        return { email, publicAddress };
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