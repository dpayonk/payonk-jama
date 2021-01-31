import { Magic } from 'magic-sdk';
import {Logger, UserRepository} from 'payonkjs';
import ConfigService from '../ConfigService';

import AuthenticationProfile from '../magic/AuthenticationProfile';
import StateStore from '../StateStore';


class AuthService {
  cfg: ConfigService; 
  static getInstance: () => any;
  
  constructor() {
    this.cfg = new ConfigService();
  }

  getMagicFactory() {
    const apiKey = this.cfg.get_magic_key();
    return new Magic(apiKey);
  }

  async isLoggedIn() {
    const isLoggedIn = await this.getMagicFactory().user.isLoggedIn();
    Logger.info(`AuthService.isLoggedIn():`, isLoggedIn);
    return isLoggedIn;
  }

  async logout() {
    let m = this.getMagicFactory();
    m.user.logout();
    // remove from localStorage as well
    UserRepository.clearAll();
  }

  async loginMagic(emailAddress: string) {
    // Method to start authentication, 
    UserRepository.storeEmail(emailAddress);
    let didToken = await this.getMagicFactory().auth.loginWithMagicLink({
      email: emailAddress,
      showUI: true,
      redirectURI: this.getRedirectUri()
    });
    this.saveAuthentication(didToken);
  }

  // Move to AccountProfileService
  async saveAuthentication(didToken: string): Promise<AuthenticationProfile> {
    UserRepository.storeKey('didToken', didToken);
    UserRepository.storeKey('updatedAt', new Date().toString());
    let subscribers = StateStore.publishEvent('onLogin', {'didToken': didToken });
    Logger.info(`Subscribers notified:`, subscribers);
    
    return new AuthenticationProfile(UserRepository.getEmailAddress(), didToken);
  }

  async onAuthenticationRedirectCallback(): Promise<AuthenticationProfile>  {
    // Method called by redirect (from app.js)
    let didToken = await this.getMagicFactory().auth.loginWithCredential();
    let authenticationProfile = await this.saveAuthentication(didToken);
    return authenticationProfile;
  }

  getRedirectUri() {
    const appUrl = this.cfg.getAuthRoute();
    return `${window.location.protocol}//${window.location.host}${appUrl}`;
  }

  async getAuthenticationProfile(): Promise<AuthenticationProfile> {
    if (await this.isLoggedIn()) {
      try {
        const { issuer, email, publicAddress } = await this.getMagicFactory().user.getMetadata();
        const didToken = await this.getMagicFactory().user.getIdToken();
        let authProfile = new AuthenticationProfile(email, didToken);
        authProfile.issuer = issuer;
        authProfile.publicAddress = publicAddress;
        return authProfile;
      } catch (error) {
        Logger.error(`Auth service had a problem getting magic metadata`, error);
        return null;
      }
    } else {
      return null;
    }
  }
}

AuthService.getInstance = function(){
  if(this.SINGLETON !== undefined){
    return this.SINGLETON;
  } else {
    this.SINGLETON = new AuthService({});
    return this.SINGLETON;
  }
}

export default AuthService