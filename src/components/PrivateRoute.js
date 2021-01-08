import React from "react"
import { navigate } from "gatsby"
// import AuthService from './services/AuthService'

const PrivateRoute = async ({ component: Component, location, ...rest }) => {

    // TODO: Just check for previous existence, validate in    
    // let authService = new AuthService();
    console.log("Loading private route");

    // let beenHereBefore = authService.hasBeenHere();
    let beenHereBefore = true;
    
    if (!beenHereBefore && location.pathname !== `/app/login`) {
        navigate("/app/login")
        return null
    }

    return <Component {...rest} />
}


export default PrivateRoute