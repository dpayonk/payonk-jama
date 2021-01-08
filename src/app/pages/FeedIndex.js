import React from 'react'
import { Link } from 'gatsby'
import get from 'lodash/get'
import Helmet from 'react-helmet'
import { graphql } from 'gatsby'
import Layout from '../../components/layout'
import { LoadableCliqueViewer } from '../client_library'
import ConfigService from '../ConfigService'

class FeedIndex extends React.Component {
  render() {
    const siteTitle = get(
      this,
      'props.data.cosmicjsSettings.metadata.site_title'
    )
    const location = get(this, 'props.location')
    let cfg = new ConfigService();
    const environment = cfg.get_environment();
    let bannerStyle = {
      position: 'absolute', top: '0px', left: '0px', marginTop: '70px',
      background: "red", width: '100%', textAlign: 'center', color: 'white'
    };
    if (environment === 'production') {
      bannerStyle.background = 'green';
    }

    return (
      <Layout location={location}>
        <div style={bannerStyle}>{environment}</div>
        <Helmet title={siteTitle} />
        <div className="container main-content">
          <h1 style={{ textAlign: "center", paddingBottom: "1vh" }}>Our Family Feed</h1>
          <div className="container">
            <LoadableCliqueViewer />
          </div>
        </div>
      </Layout>
    )
  }
}

export default FeedIndex
