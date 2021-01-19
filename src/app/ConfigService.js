import React, { Component } from "react"
import PropTypes from "prop-types"
import UserStore from "./repository/UserStore";


class ConfigService extends Component {

    constructor(props) {
        super(props);
        this.environment = process.env.NODE_ENV;
        this.configs = {
            'development': {
                'MAGIC_PUBLISHABLE_KEY': 'pk_test_05CC9C10E2A6DA8C'
            },
            'production': {
                'MAGIC_PUBLISHABLE_KEY': 'pk_live_BEFCA7F174211F15'
            }
        }
    }

    get_environment(){
        return this.environment;
    }

    getAppRoute(){
        return '/app';
    }

    getAuthRoute(){
        return '/app/login';
    }

    get_magic_key(){        
        if(this.environment !== 'production'){
            // console.log(`Using key: ${this.configs.development.MAGIC_PUBLISHABLE_KEY}`)
            return this.configs.development.MAGIC_PUBLISHABLE_KEY;
        } else {
            return this.configs.production.MAGIC_PUBLISHABLE_KEY;
        }        
    }
    
    get(key){
        return ConfigService.get(key);
    }

    getJWT(){
        return UserStore.getJWT();
    }
}

ConfigService.STATIC = {
    'BACKEND_ENDPOINT': {'development': 'https://dev-api.payonk.com', 'production': "https://api.payonk.com"},    
}

ConfigService.getBackend = function(){
    const environment = process.env.NODE_ENV;
    return ConfigService.STATIC['BACKEND_ENDPOINT'][environment];
}

ConfigService.get = function(key){
    const environment = process.env.NODE_ENV;

    if(ConfigService.STATIC[key] !== undefined){
        const val = ConfigService.STATIC[key][environment];
        return val;
    }else{
        console.error(`There was no configuration setup for ${key}`);
    }
}

export default ConfigService;