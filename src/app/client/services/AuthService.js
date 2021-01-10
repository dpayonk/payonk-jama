import { Magic } from 'magic-sdk';
import ConfigService from '../../ConfigService';
import Logger from '../../Logger';
import UserModel from '../UserModel';


class AuthService { 
  statics(){
    const apiUrl = ConfigService.get('BACKEND_ENDPOINT');
    return {
      'apiEndpoint': `${apiUrl}/authorized`
    }
  }
  constructor(props) {
    // TODO: Pull from localStorage the sessionToken perhaps...
    // super(props)
    // props.userModel
    this.UserModel = (props!== undefined) ? props.userModel : null;
    this.cfg = new ConfigService();
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
    let data = { emailAddress: emailAddress, permissionName: permissionName };
    console.log(`Checking permission ${permissionName} for email: ${emailAddress}`)
    try {
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
    } catch (error) {
      console.error("An exception occurred trying to obtain authorization", error);
      return false;
    }
  }

  async loginMagic(emailAddress) {
    let token = await this.getMagicFactory().auth.loginWithMagicLink({
      email: emailAddress,
      showUI: true,
      redirectURI: this.getRedirectUri()
    });
    console.log(`Saving ${emailAddress} and DID Token: ${token}`);
    UserModel.storeEmail(emailAddress);
    UserModel.storeKey('accessToken', token);
    UserModel.storeKey('updatedAt', new Date());
    UserModel.storeKey('updatedBy', 'loginWithMagicLink');
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
    UserModel.storeKey('updatedBy', 'loginWithCredential');
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