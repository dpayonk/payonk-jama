import { Magic } from 'magic-sdk';


class AuthService{
  constructor(){
    const apiKey = 'pk_test_05CC9C10E2A6DA8C';
    this.magic = new Magic(apiKey);
  }

  async isLoggedIn(){      
      const isLoggedIn = await this.magic.user.isLoggedIn();
      return isLoggedIn;
  }

  hasBeenHere(){
    return true;
  }

  async getProfile() {
    if(await this.isLoggedIn()){
      debugger;
      return this.magic.user.getProfile;
    } else {
      return null;
    }
  }
}

export default AuthService