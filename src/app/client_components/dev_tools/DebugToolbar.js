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
            alert: ConfigService.getEnvironment(),
            status: 'initialized'
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
        this.setState({ serverHealth: serverHealth, status: 'mounted' });
    }

    render() {

        let alertClass = 'notification is-info';
        let alertVisibility = (this.props.alert !== undefined && this.props.alert !== "") ? 'visible' : 'hidden';

        if (this.state.serverHealth !== true) {
            alertVisibility = 'visible';
            alertClass = 'notification is-danger';
        }
        if (this.state.status !== 'mounted') {
            return (<div></div>);
        }
        if(alertVisibility !== 'visible'){
            Logger.info("DebugToolbar not visible");
        }

        return (
            <div id="debug-toolbar" style={{
                visibility: alertVisibility,
                minWidth: "200px",
                marginBottom: "7px", padding: "7px",
                position: "absolute", bottom: "0px", right: "10px"
            }}>
                <div className={alertClass}>
                    {this.props.alert}
                    <div style={{ borderTop: "1px solid grey" }}>
                        {this.state.alert}
                    </div>
                </div>

            </div>

        )
    }
}

export default DebugToolbar;



