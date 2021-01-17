class AccountProfile {
    emailAddress: string;
    didToken: string;
    static fromPythonResponse: (json_data: any) => AccountProfile;
    static validateJsonResponse: (json_data: any) => boolean;
    validateJsonResponse
    constructor(emailAddress: string) {
        this.emailAddress = emailAddress;
    }

    greet() {
        return "Hello, " + this.emailAddress;
    }

    toJson(){
        return {
            'email': this.emailAddress,
            'didToken': this.didToken
        }
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
    model.didToken
    return model;
}


export default AccountProfile;