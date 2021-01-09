class UserModel {
    constructor(props){
        if(props === undefined){
            this.emailAddress == null;
            console.log("Initializing empty model");
        }
        else if(props.emailAddress !== undefined && props.emailAddress !== null){
            UserModel.storeEmail(props.emailAddress);
            this.emailAddress = props.emailAddress;
        } else {
            this.emailAddress == null;
        }        
    }

    getEmail(){        
        return this.emailAddress;
    }

    setCookie(name,value,days) {
        var expires = "";
        if (days) {
            var date = new Date();
            date.setTime(date.getTime() + (days*24*60*60*1000));
            expires = "; expires=" + date.toUTCString();
        }
        document.cookie = name + "=" + (value || "")  + expires + "; path=/";
    }
    getCookie(name) {
        var nameEQ = name + "=";
        var ca = document.cookie.split(';');
        for(var i=0;i < ca.length;i++) {
            var c = ca[i];
            while (c.charAt(0)==' ') c = c.substring(1,c.length);
            if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
        }
        return null;
    }
    eraseCookie(name) {   
        document.cookie = name +'=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    }
}

UserModel.storeEmail = function(emailAddress){
    // if it exists, should throw a warning
    window.localStorage.setItem('emailAddress', emailAddress);
    this.emailAddress = emailAddress;
}

UserModel.getEmailFromLocalStorage = function(){
    return window.localStorage.getItem('emailAddress');
}

UserModel.storeKey = function(key, val){
    window.localStorage.setItem(key, val);
}

UserModel.loadModelFromStorage = function(){
    console.log("Loading user model from LocalStorage");
    let emailAddress = UserModel.getEmailFromLocalStorage();

    if(emailAddress === null){
        console.log("No email has been stored");
        return null;
    }    
    let userModel = new UserModel({emailAddress: emailAddress});
    return userModel;
}

export default UserModel