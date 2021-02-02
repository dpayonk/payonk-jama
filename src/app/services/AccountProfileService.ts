import {
  Logger,
  BaseService,
  ISerializableObject,
  IParsedResponse,
  UserRepository,
} from "payonkjs";
import ConfigService from '../ConfigService';
import AccountProfile from "../models/AccountProfile";
import AuthenticationProfile from '../models/AuthenticationProfile';


class AccountProfileService extends BaseService {
  static SINGLETON: AccountProfileService;

  static getInstance(): AccountProfileService {
    if (this.SINGLETON !== undefined) {
      return this.SINGLETON;
    } else {
      this.SINGLETON = new AccountProfileService(ConfigService.getBackend());
      return this.SINGLETON;
    }
  }

  endpoints() {
    const apiUrl = this.baseUrl;
    return {
      authorizedRouteUrl: { url: `${apiUrl}/account/authorized` },
      myProfileRouteUrl: { url: `${apiUrl}/account/me` },
      createProfileRouteUrl: { url: `${apiUrl}/profile/create` },
    };
  }

  async apiPost(remoteUrl: string, requestSchema: any, responseObject:any): Promise<IParsedResponse>{
    let response = await super.apiPost(remoteUrl, requestSchema, responseObject);
    return response;
  }

  generateHeaders() : Record<string, string> {
    let originalResult = super.generateHeaders();
    let jwtToken = UserRepository.getJWT();

    if (this.hasJWT()) {
      return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwtToken}`
      };
    }
    Logger.info('JWT tokens are not currently present', jwtToken);
    return {
      'Content-Type': 'application/json'
    }
  }

  async createProfile(
    authenticationProfile: AuthenticationProfile
  ): Promise<AccountProfile | null | Error> {
    // public_address: authenticationProfile.publicAddress,
    // issuer: authenticationProfile.issuer
    let createProfileRequestSchema = {
      email_address: authenticationProfile.emailAddress,
      did_token: authenticationProfile.didToken,
      issuer: authenticationProfile.issuer,
    };
    try {
      let { ok, model, data, errors } = await this.apiPost(
        this.endpoints().createProfileRouteUrl.url,
        createProfileRequestSchema,
        AccountProfile
      );

      if (ok && errors === "") {
        if (data.jwt_token !== undefined && data.jwt_token !== "") {
          Logger.alert(`A new JWT token was issued`, data.jwt_token);
          UserRepository.publishJWT(data.jwt_token);
        } else {
          
          Logger.alert(`JWT token was not issued`, data.jwt_token);
        }
        return model as AccountProfile;
      } else {
        throw `AccountProfileService.createProfile: Service Exception: ${errors}`
      }

    } catch (error) {
      Logger.error(`An exception occured creating profile`, error);
    }
    return null;
  }

  // could help with context (know who you are) vs. regular rest call
  async fetchMyProfile(): Promise<AccountProfile | null> {
    try {
      // this should almost always have a jwt token
      let { ok, model, errors } = await this.apiGet(
        this.endpoints().myProfileRouteUrl.url,
        { permission: "my_profile" },
        AccountProfile
      );
      debugger;

      if (ok && errors === "") {
        return model as AccountProfile;
      } else {
        Logger.warn(
          "AccountProfileService.fetchMyProfile: Permission error",
          errors
        );
        // This is mostly a permission error
      }
    } catch (error) {
      Logger.error(
        `AccountProfileService.fetchMyProfile: Exception in BaseService`,
        error
      );
      return null;
    }
    return null;
  }

  hasJWT(){
    let baseValue = super.hasJWT();
    let b = window.localStorage.getItem('jwtToken');

    let overridenVal =  (b !== null && b !== '');
    if(overridenVal !== baseValue){
      debugger;
      Logger.alert("need to fix this upstream", null);
    }
    return overridenVal;
  }

  async fetchAuthorizationStatus(
    emailAddress: string,
    permissionName: string
  ): Promise<boolean> {
    let variables = {
      email_address: emailAddress,
      permissionName: permissionName,
    };

    debugger;
    if (this.hasJWT() === false) {
      Logger.alert("No token present.  A profile needs to be created.", null);
      return false;
    }
    debugger;
    Logger.info(
      `Checking permission ${permissionName} for email:`,
      emailAddress
    );
    try {
      let response = await fetch(this.endpoints().authorizedRouteUrl.url, {
        method: "POST",
        mode: "cors",
        cache: "no-cache",
        headers: this.generateHeaders(),
        body: JSON.stringify(variables),
      });

      let jsonResponse = await response.json();
      Logger.info(`AuthService.getAuthorizationProfile:`, jsonResponse);
      if (jsonResponse.data === undefined) {
        throw new Error("Invalid Schema Response.  No data element defined");
      }

      // responseSchema = {data: {authenticated: bool, authorized: bool}, errors: string}
      let data = jsonResponse.data;

      if (jsonResponse.errors === "") {
        if (data.authorized !== undefined || data.authorized !== null) {
          return data.authorized;
        }
      } else {
        Logger.error(
          "AccountProfileService.fetchAuthorizationStatus: Error in response",
          jsonResponse.errors
        );
      }
    } catch (error) {
      Logger.error(
        "An exception occurred trying to obtain authorization",
        error
      );
      // may need to set serverHealth to false
    }
    return false; // only returns true on happy path
  }
}

export default AccountProfileService;
