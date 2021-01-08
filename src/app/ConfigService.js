import React, { Component } from "react"
import PropTypes from "prop-types"


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
        return '/app/auth';
    }

    getSetting(key) {
        console.log(`Fetching maybe unknown key ${key}`);
        console.log(`Current Environment: ${this.environment}`);
        if(this.environment !== 'production'){
            return this.configs.development[key];
        } else {
            return this.configs.production[key];
        }   
    }

    get_magic_key(){        
        if(this.environment !== 'production'){
            // console.log(`Using key: ${this.configs.development.MAGIC_PUBLISHABLE_KEY}`)
            return this.configs.development.MAGIC_PUBLISHABLE_KEY;
        } else {
            return this.configs.production.MAGIC_PUBLISHABLE_KEY;
        }        
    }
}

export default ConfigService;