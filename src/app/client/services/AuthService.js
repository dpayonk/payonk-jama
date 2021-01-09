import { Magic } from 'magic-sdk';
import ConfigService from '../../ConfigService';
import UserModel from '../UserModel';

class AuthService { 
  statics(){
    return {
      'apiEndpoint': 'https://api.payonk.com/authorized'
    }
  }
  constructor(props) {
    // TODO: Pull from localStorage the sessionToken perhaps...
    // super(props)
    this.cfg = new ConfigService();
    this.emailAddress = "";
  }

  get(key){
    return this.emailAddress;
  }

  set(key, val){
    this.emailAddress = val;
  }

  getMagicFactory() {
    const apiKey = this.cfg.get_magic_key();
    return new Magic(apiKey);
  }

  async isLoggedIn() {
    const isLoggedIn = await this.getMagicFactory().user.isLoggedIn();
    console.log(`AuthService.isLoggedIn(): ${isLoggedIn}`);
    return isLoggedIn;
  }

  hasBeenHere() {
    return true;
  }

  getRedirectUri() {
    const appUrl = this.cfg.getAuthRoute();
    return `${window.location.protocol}//${window.location.host}${appUrl}`;
  }

  async isAuthorized(emailAddress, permissionName) {
    let data = { email: emailAddress, permissionName: permissionName };
    console.log(`Checking permission ${permissionName} for email: ${emailAddress}`)
    let response = await fetch(this.statics().apiEndpoint, {
      method: 'POST',
      mode: 'cors',
      cache: 'no-cache',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    let message = await response.json();
    console.log(`AuthService.isAuthorized:`,message);
    
    if (message.authorized === undefined || message.authorized === null) {
      isAuthorized = false;
    } else {
      return message.authorized;
    }
  }

  async loginMagic(emailAddress) {
    /* One-liner login 🤯 */
    // The reference implementation is wrong
    this.set('emailAddress', emailAddress);

    let token = await this.getMagicFactory().auth.loginWithMagicLink({
      email: emailAddress,
      showUI: true,
      redirectURI: this.getRedirectUri()
    });
    console.log(`DID Token: ${token}`);
  }

  async logout() {
    let m = this.getMagicFactory();
    m.user.logout();
  }

  async onRedirectLogin() {
    let m = this.getMagicFactory();
    let accessToken = await m.auth.loginWithCredential();
    UserModel.storeKey('accessToken', accessToken);
    UserModel.storeKey('updatedAt', new Date());
    // TODO: Potentially store this
  }

  async getProfile() {
    if (await this.isLoggedIn()) {
      try {
        const { email, publicAddress } = await this.getMagicFactory().user.getMetadata();
        console.log("AuthService.getProfile: TODO: Remove static permission feed");
        let isAuthorized = await this.isAuthorized(email, 'feed');
        return { email, isAuthorized, publicAddress };
      } catch (error) {
        console.error("An error was thrown obtaining profile");
        console.error(error);
        return null;
      }
    } else {
      return null;
    }
  }
}

export default AuthService