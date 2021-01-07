import React from 'react'
import get from 'lodash/get'
import Helmet from 'react-helmet'
import Layout from '../components/layout'


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
        <section className="main-content">
        <h1 style={{paddingBottom: "3vh"}}>About this site</h1>
        <p style={{maxWidth: "75vw"}}>
            This site is maintained by <a href="https://medium.com/@dpayonk">Dennis Payonk</a> for 
            overengineered super cool projects and a home for content you hopefully find interesting.  
            </p>
            <p>
            Any opinions here reflect my own and not any of my employers.
        </p>
        </section>
        
      </Layout>
    )
  }
}

export default AboutIndex