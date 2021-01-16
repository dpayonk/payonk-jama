import { Magic } from 'magic-sdk';
import ConfigService from '../ConfigService';
import Logger from '../Logger';
import AccountProfile from '../models/AccountProfile';


class AccountProfileService { 
  statics(){
    const apiUrl = ConfigService.get('BACKEND_ENDPOINT');
    return {
      'apiEndpoint': `${apiUrl}/profile/`
    }
  }
  constructor(props) {
    // TODO: Pull from localStorage the sessionToken perhaps...
    // props.userModel
    this.profileModel = (props!== undefined) ? props.profileModel : null;
    this.cfg = new ConfigService();
  }

  async createProfile(){
    let profile = new AccountProfile();
    profile.emailAddress = 'dennis@payonk.com';
    return profile;
  }

  async fetchUserProfile() {
      let profile = new Profile();
      profile.emailAddress = 'dennis@payonk.com';
      return profile;
    // if (await this.isLoggedIn()) {
    //   try {
    //     const { email, publicAddress } = await this.getMagicFactory().user.getMetadata();
    //     // Mapping email to emailAddress for internal model
    //     UserModel.storeKey('publicAddress', publicAddress);
    //     let emailAddress = email;
    //     return { emailAddress, publicAddress };
    //   } catch (error) {
    //     Logger.error(`Auth service had a problem getting magic metadata`, error);
    //     return null;
    //   }
    // } else {
    //   return null;
    // }
  }
}

export default AccountProfileService