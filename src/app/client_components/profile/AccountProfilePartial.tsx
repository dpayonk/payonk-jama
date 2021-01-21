import React from 'react'
import AccountProfile from '../../models/AccountProfile'
import UserStore from '../../repository/UserStore'

type ProfileProps = {
  accountProfile: AccountProfile
}

export default ({ accountProfile }: ProfileProps) => {
  function handleSave(event) {
    console.log('Save')
  }

  function handleCreate(event) {
    console.log('Create')
  }

  let localEmail = UserStore.getEmailAddress()
  const synced = localEmail === accountProfile.emailAddress
  let alertMessage = ( synced ) ? '' : `Please refresh your session.  You've been unauthorized`;
  let ActionButton = (accountProfile === null) ? (
    <button
      onClick={handleSave}
      className={
        synced
          ? 'button is-pulled-right is-primary'
          : 'button is-pulled-right is-danger'
      }
    >
      Create Profile
    </button>
  ) : (
    <button
      onClick={handleCreate}
      className={
        synced
          ? 'button is-pulled-right is-primary'
          : 'button is-pulled-right is-danger'
      }
    >
      Refresh Session
    </button>
  )

  return (
    <div className="box">
      <div className="is-pulled-right">{ActionButton}</div>
      <h2>My Account Profile</h2>
      <div style={{minHeight: '40px'}}>
      {alertMessage.length > 0 &&
        <div className="alert-message">
        {alertMessage}
        </div>
      }
      </div>
      <div className="data-detail-control">
        <label className="label">Email</label>
        <div className="field is-pulled-right">{accountProfile.emailAddress}</div>
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
