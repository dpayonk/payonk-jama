import ConfigService from '../ConfigService';
import Logger from '../Logger';
import AccountProfile from '../models/AccountProfile';
import AuthenticationProfile from '../models/AuthenticationProfile';
import UserStore from "../repository/UserStore";


class AccountProfileService {
  cfg: ConfigService;

  endpoints() {
    const apiUrl = ConfigService.get('BACKEND_ENDPOINT');
    return {
      'authorizedRouteUrl': `${apiUrl}/account/authorized`,
      'createProfileRouteUrl': `${apiUrl}/account/create`,
      'myProfileRouteUrl': `${apiUrl}/account/me`,
    }
  }
  constructor() {
    this.cfg = new ConfigService();
  }

  generateHeaders() {
    const jwt = UserStore.getJWT();
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${jwt}`
    };
  }

  async createProfile(authenticationProfile: AuthenticationProfile): Promise<AccountProfile> {
    // public_address: authenticationProfile.publicAddress,
    // issuer: authenticationProfile.issuer
    let createProfileRequestSchema = {
      email_address: authenticationProfile.emailAddress,
      did_token: authenticationProfile.didToken
    }

    // let newAuthenticationProfile = await post('/profile', inputObject, outputType)
    // this.generateHeaders()
    let response = await fetch(this.endpoints().createProfileRouteUrl, {
      method: 'POST', mode: 'cors', cache: 'no-cache',
      headers: {},
      body: JSON.stringify(createProfileRequestSchema)
    });
    let jsonResponse = await response.json();

    if (response.ok) {
      Logger.info('Should set up JWT now if no errors');
      // parsing like a graphql schema
      if (jsonResponse.errors !== "" && jsonResponse.data !== undefined) {
        // check schema response
        Logger.info('Should set up JWT now');//         debugger;
        let data = jsonResponse.data;
        if (data.jwt !== undefined) {
          Logger.info(`Saving JWT token`);
          UserStore.storeKey('JWT', data.jwt); // may want to decouple?
        }

        if (AccountProfile.validateJsonResponse(jsonResponse)) {
          let accountProfile = new AccountProfile('dennis@payonk.com');
          // jsonResponse.jwt, jsonResponse.is_valid,  jsonResponse.did_token

          return accountProfile;
        }
      }
      Logger.info("AccountProfileService.createProfile: A schema response error occured.")
      return null;
    } else {
      Logger.info("This path needs to be solved on edge cases");
    }

    Logger.info("AccountProfileService.createProfile: A server error occured.")
    return null;
  }

  // could help with context (know who you are) vs. regular rest call
  async fetchMyProfile(): Promise<AccountProfile> {
    try {
      // TODO: How to send body: JSON.stringify(fetchProfileSchema) in GET instead of body
      let response = await fetch(this.endpoints().myProfileRouteUrl, {
        method: 'GET', mode: 'cors', cache: 'no-cache',
        headers: this.generateHeaders()
      });
      let jsonResponse = await response.json();
      if (jsonResponse.errors === undefined) {
        debugger;
      }
      Logger.info(`AuthService.getAuthorizationProfile:`, jsonResponse);

      return AccountProfile.fromPythonResponse(jsonResponse.data);
    } catch (exc) {
      return null;
    }
  }

  // TODO: Move to Account
  async getAuthorizationStatus(emailAddress: string, permissionName: string): Promise<boolean> {
    let didToken = "TODO: Find this one";
    let variables = {
      emailAddress: emailAddress,
      permissionName: permissionName
    };

    Logger.info(`Checking permission ${permissionName} for email: ${emailAddress}`)
    try {
      let requestHeaders = { 'Content-Type': 'application/json' };

      let response = await fetch(this.endpoints().authorizedRouteUrl, {
        method: 'POST',
        mode: 'cors',
        cache: 'no-cache',
        headers: requestHeaders,
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

export default AccountProfileService