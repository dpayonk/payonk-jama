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
      // Assumes a user is already logged in
      try {

        const { email, publicAddress } = await this.magic.user.getMetadata();
        console.log("No exctuion");
        return {email, publicAddress};
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