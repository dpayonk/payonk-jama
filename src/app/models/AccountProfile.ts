import { ISerializableObject, SerializationMixin, Logger } from 'payonkjs';

class AccountProfile extends SerializationMixin implements ISerializableObject {
    key: string = "";
    createdAt: string = "";
    emailAddress: string = ""; // need to define default to implement fillFromJSON
    currentRole: string = "";
    friendlyName: string = "Guest";
    authenticated: boolean = false;

    
    static validateJsonResponse: (json_data: any) => boolean;
    static fromJson: (jsonResponse: any) => AccountProfile | null;

    constructor(props: Object = {}) {
        super();
        this.fillFromJSON(props);            
    }
    
    toJson(){
        return {
            'emailAddress': this.emailAddress,      
            'currentRole': this.currentRole      
        }
    }

    fromJson(jsonResponse: any){
        return AccountProfile.fromJson(jsonResponse);
    }
}


AccountProfile.validateJsonResponse = function(json_data): boolean{
    // test all required values are populated    
    if(json_data['email_address'] !== undefined){
        return true;
    }

    return false;
}


AccountProfile.fromJson = function(jsonResponse: Object): AccountProfile | null {
    try{
        if(AccountProfile.validateJsonResponse(jsonResponse)){
            let jsonData = AccountProfile.convertToCamelCase(jsonResponse);
            return new AccountProfile(jsonData); 
        }
    }catch(exc){
        Logger.warn(`AccountProfile.fromJson: ${exc.toString()}`, exc);
        Logger.alert(`AccountProfile.fromJson: Could not serialize response:`, jsonResponse);
    }
    
    return null;
}

export default AccountProfile;