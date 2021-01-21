import React from 'react'
import UserStore from '../../repository/UserStore';


export default ({ props }) => {
    function handleRefresh() {

    }
    let emailAddress = UserStore.getEmailAddress();
    let jwtToken = UserStore.getJWT();

    return (
        <div className="box">
              <h3>Local Settings</h3>
              <div style={{ padding: '7px' }}>
                <label className="label">Email</label>
                <div className="field">{emailAddress}</div>
              </div>
              <div style={{ padding: '7px' }}>
                <label className="label">Session Access Token</label>
                <div className="field">{jwtToken}</div>
              </div>
            </div>
    )
}

