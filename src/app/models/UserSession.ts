import AccountProfile from './AccountProfile';
import AuthenticationProfile from '../magic/AuthenticationProfile';


class UserSession {
    /*
    [Reference](https://docs.magic.link/client-sdk/web/api-reference)
    */
   // removed email
    jwtToken: string;
    authenticationProfile: AuthenticationProfile;
    accountProfile: AccountProfile;
}


export default UserSession;