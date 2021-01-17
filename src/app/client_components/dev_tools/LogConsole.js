import React from 'react';


class LogConsole extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            Log: []
        };
    }

    render() {
        return (
            <div>
                {
                    this.state.Log.map((log) => {
                        return (
                            <div id={log.key}>
                                <p>{log.message}</p>
                            </div>
                        )
                    })
                }
            </div>

        )
    }
}

export default LogConsole;