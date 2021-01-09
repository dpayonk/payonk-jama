import React from 'react'
import get from 'lodash/get'
import Helmet from 'react-helmet'
import Layout from '../../components/layout'
import { LoadableFeedViewer } from '../client_library'
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
          <div className="main-content columns">
            <div className="column">
              <h1 className="has-text-centered">Our Family Feed</h1>
              <div className="container">
                <LoadableFeedViewer authService={this.props.authService} />
              </div>
            </div>
          </div>
        </div>
      </Layout>
    )
  }
}

export default FeedIndex
