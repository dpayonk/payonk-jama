import Logger from '../Logger';

class UserModel {
    constructor(props){
        if(props === undefined){
            this.emailAddress == null;
            Logger.info("UserModel: Initializing model with null email");
        }
        else if(props.emailAddress !== undefined && props.emailAddress !== null){
            UserModel.storeEmail(props.emailAddress);
            this.emailAddress = props.emailAddress;
        } else {
            this.emailAddress == null;
        }        
    }

    updateEmail(emailAddress){
        this.emailAddress = emailAddress;
        UserModel.publishUpdate(this);
    }
}

UserModel.onUpdate = function(callback){
    UserModel.SUBSCRIBERS = UserModel.SUBSCRIBERS || [];
    UserModel.SUBSCRIBERS.push(callback);
}

UserModel.publishUpdate = function(userModel){
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

UserModel.storeEmail = function(emailAddress){
    // if it exists, should throw a warning
    // required for gatsby: https://www.gatsbyjs.com/docs/debugging-html-builds/
    if (typeof window === `undefined`) {
        console.log("NOOP, for gatsby");
    } else {
        window.localStorage.setItem('emailAddress', emailAddress);
        this.emailAddress = emailAddress;    
    }
}

UserModel.getEmailFromLocalStorage = function(){
    if (typeof window === `undefined`) {
        console.log("NOOP, for gatsby");
    } else {
        return window.localStorage.getItem('emailAddress');
    }
}

UserModel.storeKey = function(key, val){
    if (typeof window === `undefined`) {
        console.log("NOOP, for gatsby");
    } else {
        window.localStorage.setItem(key, val);
    }
}

UserModel.loadModelFromStorage = function(){
    console.log("Loading user model from LocalStorage");
    let emailAddress = UserModel.getEmailFromLocalStorage();

    if(emailAddress === null){
        console.log("No email has been stored");
        return new UserModel();
    }    

    let userModel = new UserModel({emailAddress: emailAddress});
    return userModel;
}

export default UserModel