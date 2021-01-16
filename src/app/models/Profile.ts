class Profile {
    emailAddress: string;
    accessToken: string;

    constructor(emailAddress: string) {
        this.emailAddress = emailAddress;
    }

    greet() {
        return "Hello, " + this.emailAddress;
    }
}


export default Profile;