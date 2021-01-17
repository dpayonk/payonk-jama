import AccountProfile from './AccountProfile';
import AuthenticationProfile from './AuthenticationProfile';


class UserSession {
    /*
    [Reference](https://docs.magic.link/client-sdk/web/api-reference)
    */
    emailAddress: string; // acts as the key
    jwtToken: string;
    authenticationProfile: AuthenticationProfile;
    accountProfile: AccountProfile;
}


export default UserSession;