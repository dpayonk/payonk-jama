import { Magic } from 'magic-sdk';
import ConfigService from '../ConfigService';
import Logger from '../Logger';
import UserModel from '../models/UserModel';
import StateStore from '../StateStore';


class AuthService { 
  statics(){
    const apiUrl = ConfigService.get('BACKEND_ENDPOINT');
    return {
      'apiEndpoint': `${apiUrl}/profile/authorized`
    }
  }
  constructor(props) {
    this.cfg = new ConfigService();
    // TODO: Pull from localStorage the sessionToken perhaps...
    this.UserModel = (props!== undefined) ? props.userModel : null;
  }

  getMagicFactory() {
    const apiKey = this.cfg.get_magic_key();
    return new Magic(apiKey);
  }

  async isLoggedIn() {
    const isLoggedIn = await this.getMagicFactory().user.isLoggedIn();
    Logger.info(`AuthService.isLoggedIn(): ${isLoggedIn}`);
    return isLoggedIn;
  }

  async logout() {
    let m = this.getMagicFactory();
    m.user.logout();
  }

  async loginMagic(emailAddress) {
    // Method to start authentication, 
    UserModel.storeEmail(emailAddress);
    let token = await this.getMagicFactory().auth.loginWithMagicLink({
      email: emailAddress,
      showUI: true,
      redirectURI: this.getRedirectUri()
    });
    this.saveAuthentication(token);
  }

  // Move to AccountProfileService
  async saveAuthentication(didToken){
    Logger.info(`Saving DID Token: ${didToken}`);
    // removing this and only storing didId, can look it up on the server
    // UserModel.storeEmail(emailAddress);
    UserModel.storeKey('didToken', token);
    UserModel.storeKey('updatedAt', new Date());
    UserModel.storeKey('updatedBy', 'loginWithMagicLink');
    StateStore.publishEvent('onLogin', {'accessToken': accessToken });    
  }

  async onRedirectLogin() {
    // Method called by redirect (from app.js)
    let didToken = this.getMagicFactory().auth.loginWithCredential();
    this.saveAuthentication(didToken);
  }

  getRedirectUri() {
    const appUrl = this.cfg.getAuthRoute();
    return `${window.location.protocol}//${window.location.host}${appUrl}`;
  }

  async getAuthorizationStatus(emailAddress, permissionName) {
    let variables = { emailAddress: emailAddress, permissionName: permissionName };
    Logger.info(`Checking permission ${permissionName} for email: ${emailAddress}`)
    try {
      let response = await fetch(this.statics().apiEndpoint, {
        method: 'POST',
        mode: 'cors',
        cache: 'no-cache',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(variables)
      });
      let jsonResponse = await response.json();
      Logger.info(`AuthService.getAuthorizationProfile:`, jsonResponse);
      if(jsonResponse.data === undefined){
        throw new Error('Invalid Schema Response.  No data element defined');
      }
      let data = jsonResponse.data // changed to be more graphql like
      
      if (data.authorized === undefined || data.authorized === null) {
        return false;
      } else {
        return data.authorized;
      }
    } catch (error) {
      Logger.error("An exception occurred trying to obtain authorization", error);
      return false;
    }
  }

  async getAuthenticationProfile() {
    if (await this.isLoggedIn()) {
      try {
        const { email, publicAddress } = await this.getMagicFactory().user.getMetadata();
        // Mapping email to emailAddress for internal model
        UserModel.storeKey('publicAddress', publicAddress);
        let emailAddress = email;
        return { emailAddress, publicAddress };
      } catch (error) {
        Logger.error(`Auth service had a problem getting magic metadata`, error);
        return null;
      }
    } else {
      return null;
    }
  }
}


export default AuthService