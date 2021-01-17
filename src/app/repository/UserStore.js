import Logger from '../Logger';
import AccountProfile from '../models/AccountProfile';
import AuthenticationProfile from '../models/AuthenticationProfile';
import UserSession from '../models/UserSession';
import StateStore from '../StateStore';

class UserStore {
    constructor(props){
        if(props === undefined){
            this.emailAddress == null;
            Logger.info("UserStore: Initializing model with null email");
        }
        else if(props.emailAddress !== undefined && props.emailAddress !== null){
            UserStore.storeEmail(props.emailAddress);
            this.emailAddress = props.emailAddress;
        } else {
            this.emailAddress == null;
        }        
    }    
}

UserStore.onSessionUpdate = function(callback){
    StateStore.subscribe('session:update', callback);
}

UserStore.onUpdate = function(callback){
    UserStore.SUBSCRIBERS = UserStore.SUBSCRIBERS || [];
    UserStore.SUBSCRIBERS.push(callback);
}

UserStore.publishNewSession = function(userSession){
    StateStore.publishEvent('session:update', userSession);
}

UserStore.storeEmail = function(emailAddress){
    // if it exists, should throw a warning
    // required for gatsby: https://www.gatsbyjs.com/docs/debugging-html-builds/
    if (typeof window === `undefined`) {
        console.log("NOOP, for gatsby");
    } else {
        UserStore.storeKey('emailAddress', emailAddress);
        this.emailAddress = emailAddress;    
    }
}

UserStore.storeKey = function(key, val){
    if (typeof window === `undefined`) {
        console.log("NOOP, for gatsby");
    } else {
        window.localStorage.setItem(key, val);
    }
}

// TODO: Move to defined model
UserStore.loadUserSessionFromStorage = function(){
    // This should load data from localStorage (didToken, email, etc.) for authentication
    // and JWT token for API access and authorizationStatus
    
    let emailAddress = UserStore.getEmailAddress();
    if(emailAddress === null){
        Logger.info("UserStore could not load model from localCache");
    } else {
        let session = new UserSession();
        session.authenticationProfile = new AuthenticationProfile();
        session.accountProfile = new AccountProfile();
        return session;    
    }    
}

UserStore.getEmailAddress = function(){
    const emailAddress = (typeof window === `undefined`) ? null : window.localStorage.getItem('emailAddress');
    return emailAddress;
}


UserStore.getJWT = function(){
    const didToken = (typeof window === `undefined`) ? null : window.localStorage.getItem('JWT');
    return didToken;
}


UserStore.getDidToken = function(){
    const didToken = (typeof window === `undefined`) ? null : window.localStorage.getItem('didToken');
    return didToken;
}

export default UserStore