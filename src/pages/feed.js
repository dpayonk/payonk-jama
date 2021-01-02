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
        <h1 style={{paddingBottom: "3vh"}}>Our Family Feed</h1>
        <p style={{maxWidth: "75vw"}}>
            <img src="https://imgix.cosmicjs.com/cad48a00-4d6e-11eb-a95b-8ff65ff92e11-2020-04-0520-59-55664.jpeg" />
        </p>
        </section>
        
      </Layout>
    )
  }
}

export default AboutIndex

// export const pageQuery = graphql`
//   query IndexQuery {
//     allCosmicjsPosts(sort: { fields: [created], order: DESC }, limit: 1000) {
//       edges {
//         node {
//           metadata {
//             description
//             content
//             headline
//           }
//           slug
//           title
//           created(formatString: "DD MMMM, YYYY")
//         }
//       }
//     }
//     cosmicjsSettings(slug: { eq: "general" }) {
//       metadata {
//         site_title
//         author_name
//         author_bio
//         author_avatar {
//           imgix_url
//         }
//       }
//     }
//   }
// `
