import React from 'react'
import { Link } from 'gatsby'
import get from 'lodash/get'
import Helmet from 'react-helmet'
import { graphql } from 'gatsby'

import Layout from '../components/layout'
import { rhythm, scale } from '../utils/typography'

class AboutIndex extends React.Component {
  render() {
    const siteTitle = get(
      this,
      'props.data.cosmicjsSettings.metadata.site_title'
    )
    const location = get(this, 'props.location')

    return (
      <Layout location={location}>
        <Helmet title={siteTitle} />       
        <section style={{marginTop: "20vh"}}>
        <h1 style={{paddingBottom: "3vh"}}>About this site</h1>
        <p style={{maxWidth: "75vw"}}>
            This site is maintained by Dennis Payonk for all personal projects.  Any opinions
            here reflect my own and not any of my employers.
        </p>
        </section>
        
      </Layout>
    )
  }
}

export default AboutIndex