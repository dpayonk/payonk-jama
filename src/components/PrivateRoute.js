import React from "react"
import { navigate } from "gatsby"

import {LoadableAuthService} from '../app/client_library'

const PrivateRoute = async ({ component: Component, location, ...rest }) => {

    // TODO: Just check for previous existence, validate in    
    // let authService = LoadableAuthService();

    // let beenHereBefore = authService.hasBeenHere();
    let beenHereBefore = true;
    
    if (!beenHereBefore && location.pathname !== `/app/login`) {
        navigate("/app/login")
        return null
    }

    return <Component {...rest} />
}


export default PrivateRoute