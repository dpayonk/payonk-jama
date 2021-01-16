import Logger from '../Logger';

class UserManager {

}

UserManager.onUpdate = function(callback){
    UserModel.SUBSCRIBERS = UserModel.SUBSCRIBERS || [];
    UserModel.SUBSCRIBERS.push(callback);
}

UserManager.publishUpdate = function(userModel){
    // UserModel.storeEmail(emailAddress);
    Logger.info("Should store and then propogate");

    if(UserModel.SUBSCRIBERS !== undefined){
        UserModel.SUBSCRIBERS.forEach(function(callbackFunction, index){
            try {
                let result = callbackFunction(userModel);  
                Logger.info('Completed publish callback', result);          
            } catch (error) {
                Logger.error(`A subscriber to user updates failed:`, error);
            }
        });
    }
}

UserManager.storeEmail = function(emailAddress){
    // if it exists, should throw a warning
    // required for gatsby: https://www.gatsbyjs.com/docs/debugging-html-builds/
    if (typeof window === `undefined`) {
        console.log("NOOP, for gatsby");
    } else {
        window.localStorage.setItem('emailAddress', emailAddress);
        this.emailAddress = emailAddress;    
    }
}

UserManager.getEmailFromLocalStorage = function(){
    if (typeof window === `undefined`) {
        console.log("NOOP, for gatsby");
    } else {
        return window.localStorage.getItem('emailAddress');
    }
}

UserManager.storeKey = function(key, val){
    if (typeof window === `undefined`) {
        console.log("NOOP, for gatsby");
    } else {
        window.localStorage.setItem(key, val);
    }
}

UserManager.loadModelFromStorage = function(){
    console.log("Loading user model from LocalStorage");
    let emailAddress = UserModel.getEmailFromLocalStorage();

    if(emailAddress === null){
        console.log("No email has been stored");
        return new UserModel();
    }    

    let userModel = new UserModel({emailAddress: emailAddress});
    return userModel;
}

export default UserManager