import React from 'react'
import { Link } from 'gatsby'
import get from 'lodash/get'
import Helmet from 'react-helmet'
import { graphql } from 'gatsby'

import Layout from '../../components/layout'
import {LoadableAuthService} from '../client_library'

class ProfileIndex extends React.Component {

    constructor(props){
        super(props);

        this.state = {
            authService: new LoadableAuthService(),
            profile: null
        };
    }

    async componentDidMount(){
        let profile = await this.state.authService.getProfile();
        console.log(profile);
        this.setState({profile: profile});
    }

    render() {
        const siteTitle = get(
        this,
        'props.data.cosmicjsSettings.metadata.site_title'
        )
        const location = get(this, 'props.location')

        return (
        <Layout location={location}>
            <section style={{marginTop: "20vh"}}>
            <h1 style={{paddingBottom: "3vh"}}>My Profile</h1>
            <div>
                {this.state.profile}
            </div>
            </section>        
        </Layout>
        )
  }
}

export default ProfileIndex

