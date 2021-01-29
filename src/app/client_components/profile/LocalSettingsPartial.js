import React from 'react'
import UserStore from '../../repository/UserStore';


export default ({ props }) => {
    function handleRefresh() {

    }
    let jwtToken = UserStore.getJWT();
    let expiry = "Not implemented";

    return (
        <div className="box">
              <h3>Local Settings</h3>
              <div style={{ padding: '7px' }}>
                <label className="label">Session Access Token</label>
                <div className="field">{jwtToken}</div>
              </div>
              <div style={{ padding: '7px' }}>
                <label className="label">Expiry</label>
                <div className="field">{expiry}</div>
              </div>
            </div>
    )
}

