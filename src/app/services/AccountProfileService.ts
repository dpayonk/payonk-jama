import Logger from '../Logger';
import AccountProfile from '../models/AccountProfile';
import AuthenticationProfile from '../magic/AuthenticationProfile';
import BaseService from '../base/BaseService';
import UserStore from "../repository/UserStore";
import { ISerializableObject, IParsedResponse } from '../base/BaseInterfaces';

class AccountProfileService extends BaseService {
  static getInstance: () => any;

  endpoints() {
    const apiUrl = this.cfg.get('BACKEND_ENDPOINT');
    return {
      'authorizedRouteUrl': { url: `${apiUrl}/account/authorized` },
      'myProfileRouteUrl': { url: `${apiUrl}/account/me` },
      'createProfileRouteUrl': { url: `${apiUrl}/session/create` },
    }
  }

  async createProfile(authenticationProfile: AuthenticationProfile): Promise<ISerializableObject> {
    // public_address: authenticationProfile.publicAddress,
    // issuer: authenticationProfile.issuer
    let createProfileRequestSchema = {
      email_address: authenticationProfile.emailAddress,
      did_token: authenticationProfile.didToken,
      issuer: authenticationProfile.issuer
    }
    try {
      let { ok, model, data, errors } = await this.apiPost(this.endpoints().createProfileRouteUrl.url,
        createProfileRequestSchema,
        AccountProfile
      );

      if (ok && errors === "") {        
        if(data.jwt_token !== undefined){
          Logger.alert(`A new JWT token was issued`, data.jwt_token);
          UserStore.publishJWT(data.jwt_token);
        }
        return model;
      }
    } catch (error) {
      Logger.error(`An exception occured creating profile`, error);
    }
    return null;
  }

  // could help with context (know who you are) vs. regular rest call
  async fetchMyProfile(authenticationProfile: AuthenticationProfile): Promise<AccountProfile> {
    try {
      let { ok, model, errors } = await this.apiGet(this.endpoints().myProfileRouteUrl.url,
        { 'permission': 'my_profile' },
        AccountProfile);
      if (ok && errors === "") {
        return model as AccountProfile;
      } else {
        Logger.warn('AccountProfileService.fetchMyProfile: Permission error', errors);
        // This is mostly a permission error
      }
    } catch (error) {
      Logger.error(`AccountProfileService.fetchMyProfile: Exception in BaseService`, error);
      return null;
    }
    return null;
  }

  async fetchAuthorizationStatus(emailAddress: string, permissionName: string): Promise<boolean> {
    let didToken = "TODO: Find how to pass this through";
    let variables = {
      email_address: emailAddress,
      permissionName: permissionName
    };

    Logger.info(`Checking permission ${permissionName} for email: ${emailAddress}`, emailAddress);
    try {

      let response = await fetch(this.endpoints().authorizedRouteUrl.url, {
        method: 'POST', mode: 'cors', cache: 'no-cache',
        headers: this.generateHeaders(),
        body: JSON.stringify(variables)
      });
      let jsonResponse = await response.json();
      Logger.info(`AuthService.getAuthorizationProfile:`, jsonResponse);
      if (jsonResponse.data === undefined) {
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
}

AccountProfileService.getInstance = function(){
  if(this.SINGLETON !== undefined){
    return this.SINGLETON;
  } else {
    this.SINGLETON = new AccountProfileService();
    return this.SINGLETON;
  }
}


export default AccountProfileService