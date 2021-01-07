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

  async isAuthorized(emailAddress) {
    let data = { email: emailAddress };
    console.log(`Checking authorization status: ${emailAddress}`)
    let response = await fetch('https://api.payonk.com/authorized', {
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      mode: 'cors', // no-cors, *cors, same-origin
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      headers: {
        'Content-Type': 'application/json'
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: JSON.stringify(data) // body data type must match "Content-Type" header
    });
    // Other options
    // credentials: 'same-origin', // include, *same-origin, omit
    // redirect: 'follow', // manual, *follow, error
    // referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    let message = await response.json();
    console.log("Returned STatus");
    console.log(message);
    return message.authorized;
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

  async logout(){
    let m = this.getMagicFactory();
    m.user.logout();
  }

  async getProfile() {
    if (await this.isLoggedIn()) {
      // Assumes a user is already logged in
      try {

        const { email, publicAddress } = await this.getMagicFactory().user.getMetadata();
        try {
          let isAuthorized = await this.isAuthorized(email);
          if (isAuthorized === undefined || isAuthorized === null) {
            isAuthorized = false;
          }
          console.log("returning");
          console.log(isAuthorized);
          return { email, isAuthorized, publicAddress };

        } catch (error) {
          console.log("Error");
          return null;
        }
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