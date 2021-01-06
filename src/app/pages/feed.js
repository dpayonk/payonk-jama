import React from 'react'
import { Link } from 'gatsby'
import get from 'lodash/get'
import Helmet from 'react-helmet'
import { graphql } from 'gatsby'
import Layout from '../../components/layout'
import {LoadableCliqueViewer} from '../client_library'

class FeedIndex extends React.Component {
  render() {
    const siteTitle = get(
      this,
      'props.data.cosmicjsSettings.metadata.site_title'
    )
    const location = get(this, 'props.location')

    return (
      <Layout location={location}>
        <Helmet title={siteTitle} />     
        <div className="container" style={{marginTop: "10vh"}}>
          <div className="columns">
            <div className="column">
              <h1 style={{textAlign: "center", paddingBottom: "3vh"}}>Our Family Feed</h1>
            </div>
          </div>
          <div className="container">
            <LoadableCliqueViewer />
          </div>
        </div>
      </Layout>
    )
  }
}

export default FeedIndex
