import {ISerializableObject} from '../base/BaseInterfaces';

class AccountProfile implements ISerializableObject {
    emailAddress: string;

    static fromPythonResponse: (json_data: any) => AccountProfile;
    static validateJsonResponse: (json_data: any) => boolean;
    static fromJson: (jsonResponse: any) => AccountProfile;

    validateJsonResponse
    constructor(emailAddress: string) {
        this.emailAddress = emailAddress;
    }

    greet() {
        return "Hello, " + this.emailAddress;
    }

    toJson(){
        return {
            'emailAddress': this.emailAddress,            
        }
    }

    fromJson(json){
        return AccountProfile.fromJson(json);        
    }
}


AccountProfile.validateJsonResponse = function(json_data): boolean{
    // test all required values are populated    
    if(json_data['email_address'] !== undefined){
        return true;
    }

    return false;
}

AccountProfile.fromPythonResponse = function(json_data): AccountProfile{
    const emailAddress = json_data['email_address'];

    let model = new AccountProfile(emailAddress);    
    return model;
}

AccountProfile.fromJson = function(jsonResponse): AccountProfile{
    if(AccountProfile.validateJsonResponse(jsonResponse)){
        let accountProfile = new AccountProfile(jsonResponse.email_address);
        return accountProfile;
    }
    return null;
}

export default AccountProfile;