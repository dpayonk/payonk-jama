import React from 'react';
import Logger from '../../Logger';


class ServiceExplorer extends React.Component {
    constructor(props){
        /* this.props.Klass */
        super(props);        
        this.state = {
            Log: [],            
        };
        try{
            this.klass = new props.Klass();
            
        }catch(exc){
            Logger.error('Pass in the class, not an instance', exc);
        }
    }

    render() {
        const endpoints = this.klass.endpoints();   

        return (<div>
            <h6>Service: {this.klass.toString()}</h6>
            <ul>
                {
                    Object.keys(endpoints).map((route) => {
                        return (<li key={endpoints[route].url}>
                            {endpoints[route].url} / 
                            params: {JSON.stringify(endpoints[route].params)}
                            </li>);
                    })
                }
            </ul>
        </div>);
    }
}

export default ServiceExplorer;