import Logger from '../Logger';
import AccountProfile from '../models/AccountProfile';
import AuthenticationProfile from '../magic/AuthenticationProfile';
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

UserStore.storeJWT = function(jwtToken){
    if (typeof window === `undefined`) {
        console.log("NOOP, for gatsby");
    } else {
        UserStore.storeKey('jwtToken', jwtToken);        
    }
}

UserStore.storeKey = function(key, val){
    if (typeof window === `undefined`) {
        console.log("NOOP, for gatsby");
    } else {
        window.localStorage.setItem(key, val);
    }
}

UserStore.clearAuthentication = function(){
    if (typeof window === `undefined`) {
        console.log("NOOP, for gatsby");
    } else {
        window.localStorage.removeItem('emailAddress');
        window.localStorage.removeItem('publicAddress');
        window.localStorage.removeItem('didToken');
    } 
}

UserStore.clearAll = function(){
    if (typeof window === `undefined`) {
        console.log("NOOP, for gatsby");
    } else {
        UserStore.clearAuthentication();
        window.localStorage.removeItem('jwtToken');
    } 
}


UserStore.publishJWT = function(jwtToken){
    Logger.info(`New JWT token saved!`);        
    UserStore.storeJWT(jwtToken);  
}


// TODO: Move to defined model
UserStore.loadUserSessionFromStorage = function(){
    // This should load data from localStorage (didToken, email, etc.) for authentication
    // and JWT token for API access and authorizationStatus
    let emailAddress = UserStore.getEmailAddress();
    let didToken = UserStore.getDidToken();
    if(emailAddress === null || didToken === null){
        Logger.info("UserStore could not load model from localCache");
        return null;
    } else {
        let session = new UserSession();        
        session.authenticationProfile = new AuthenticationProfile(emailAddress, didToken);
        session.accountProfile = new AccountProfile({emailAddress});
        return session;    
    }    
}

UserStore.getEmailAddress = function(){
    const emailAddress = (typeof window === `undefined`) ? null : window.localStorage.getItem('emailAddress');
    return emailAddress;
}


UserStore.getJWT = function(){
    const jwtToken = (typeof window === `undefined`) ? null : window.localStorage.getItem('jwtToken');
    if(jwtToken === undefined){
        return null;
    }
    return jwtToken;
}


UserStore.getDidToken = function(){
    const didToken = (typeof window === `undefined`) ? null : window.localStorage.getItem('didToken');
    return didToken;
}

export default UserStore