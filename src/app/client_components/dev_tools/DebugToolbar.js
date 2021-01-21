import React from 'react';
import ConfigService from "../../ConfigService";
import BaseService from '../../base/BaseService';
import Logger from '../../Logger';

class DebugToolbar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            debugMode: false,
            serverHealth: false,
            alert: ConfigService.getEnvironment()
        }
        this.backend = new BaseService(ConfigService.getBackend());

        let self = this;
        Logger.subscribe("alert", function (props) {
            /* Display to notification area */
            self.setState({ alert: props.message });
            setTimeout(() => self.setState({ alert: '' }), 3000);
        });

        Logger.subscribe("debug", function (props) {
            /* Display to notification area */
            self.setState({ alert: props.message });
            setTimeout(() => self.setState({ alert: '' }), 3000);
        });

    }

    async componentDidMount() {
        let serverHealth = await this.backend.getHealth();
        if (serverHealth !== true) {
            this.setState({ debugMode: true, alert: 'Backend offline' });
        }
        this.setState({ serverHealth: serverHealth });
    }

    render() {
        let alertBackground = (this.state.serverHealth === true) ? "lightgreen" : 'red';
        let alertVisibility = 'hidden';

        if (this.props.alert !== undefined && this.props.alert !== "") {
            debugger;
            alertVisibility = 'visible';
        }

        return (
            <div id="debug-toolbar" style={{
                background: alertBackground,
                visibility: alertVisibility,
                minWidth: "200px", padding: "7px",
                position: "absolute", bottom: "0px", left: "0px"
            }}>
                {this.props.alert}
                <br />
                {this.state.alert}
            </div>

        )
    }
}

export default DebugToolbar;



