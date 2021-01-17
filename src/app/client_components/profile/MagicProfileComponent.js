import React from 'react'
//class Welcome extends React.Component {


export default ({emailAddress, publicAddress, didToken}) => {
    return (
        <div>
            <div id="email-control" className="field">
                <label className="label">Email</label>
                <div className="control has-icons-left">
                    <input readOnly="readonly" value={emailAddress} className="input " type="email" name="email"
                        required="required" placeholder="your@email.com" />
                    <span className="icon is-small is-left">
                        <i className="fas fa-envelope"></i>
                    </span>
                </div>
            </div>
            <div id="public-address-control" className="field">
                <label className="label">Public Address</label>
                <div className="control has-icons-left">
                    <input readOnly="readonly" value={publicAddress}
                        className="input " name="publicAddress"
                        required="required" />
                    <span className="icon is-small is-left">
                        <i className="fas fa-lock"></i>
                    </span>
                </div>

            </div>
            <div id="public-address-control" className="field">
                <label className="label">Magic Access Token (DID)</label>
                <div className="control has-icons-left">
                    <input readOnly="readonly" value={didToken}
                        className="input " name="publicAddress"
                        required="required" />
                    <span className="icon is-small is-left">
                        <i className="fas fa-lock"></i>
                    </span>
                </div>
            </div>
        </div>
    )
}