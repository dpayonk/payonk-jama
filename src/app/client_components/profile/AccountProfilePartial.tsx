import React from 'react'
import AccountProfile from '../../models/AccountProfile'
import UserStore from '../../repository/UserStore'

type ProfileProps = {
  accountProfile: AccountProfile,
  refreshProfileCallback: any
}

export default ({ accountProfile, refreshProfileCallback }: ProfileProps) => {
  let alertMessage = 'You have not been authorized with a '
  let localEmail = UserStore.getEmailAddress()
  let synced = false

  function handleCreate(event) {
    console.log(event);
    debugger;
    refreshProfileCallback();
  }

  if (accountProfile === null) {
    // if no AccountProfile, could be because expired JWT token
    return (
      <div className="box" style={{minHeight: "200px"}}>
        <h2>My Account Profile</h2>
        <button
          onClick={handleCreate}
          className="button is-pulled-right is-danger"
        >
          Create Session
        </button>
      </div>
    )
  }

  synced = localEmail === accountProfile.emailAddress
  alertMessage = synced
    ? ''
    : `The account email we have for you may not be the same as the one used to authenticate.`

  return (
    <div className="box">
      <div className="is-pulled-right">
        <button
          onClick={handleCreate}
          className={
            synced
              ? 'button is-pulled-right is-primary'
              : 'button is-pulled-right is-danger'
          }
        >
          Refresh Profile
        </button>
      </div>
      <h2>My Account Profile</h2>
      <div style={{ minHeight: '40px' }}>
        {alertMessage.length > 0 && (
          <div className="alert-message">{alertMessage}</div>
        )}
      </div>
      <div className="data-detail-control">
        <label className="label">Email</label>
        <div className="field is-pulled-right">
          {accountProfile.emailAddress}
        </div>
      </div>
      <div className="data-detail-control">
        <label className="label">Role Status</label>
        <div className="control is-pulled-right">
          <label className="checkbox">{accountProfile.currentRole}</label>
        </div>
      </div>
    </div>
  )
}
