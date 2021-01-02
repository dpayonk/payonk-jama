import React from 'react'
import { Link } from 'gatsby'
import get from 'lodash/get'
import Helmet from 'react-helmet'
import { graphql } from 'gatsby'

import Layout from '../components/layout'
import { rhythm, scale } from '../utils/typography'

import LoadableCliqueViewer from '../app/client_library'
// import CliqueViewer  from '../app/CliqueViewer'

class RootIndex extends React.Component {
  render() {
    const siteTitle = get(
      this,
      'props.data.cosmicjsSettings.metadata.site_title'
    )
    const posts = get(this, 'props.data.allCosmicjsPosts.edges')
    const author = get(this, 'props.data.cosmicjsSettings.metadata')
    const location = get(this, 'props.location')

    return (
      <Layout location={location}>
        <Helmet title={siteTitle} />
        <div className="container columns">
          <div className="column is-two-thirds">
            <section> 
              <section>
                  <LoadableCliqueViewer />
              </section>
                <h2>Recent Posts</h2>
              
                  {posts.map(({ node }) => {
                    const title = get(node, 'title') || node.slug
                    return (
                      <div style={{ paddingTop: "1.5rem" }} key={node.slug}>
                        
                        <h3
                          style={{
                            marginBottom: rhythm(1 / 4),
                          }}
                        >
                          <Link style={{ boxShadow: 'none' }} to={`posts/${node.slug}`}>
                            {title}
                          </Link>
                        </h3>
                        <small>{node.created}</small>
                        <p
                          dangerouslySetInnerHTML={{ __html: node.metadata.headline }}
                        />
                      </div>
                    )
                  })}
              </section>
            </div>
            <div className="column is-one-third pull-right">
              
            
                  <h2 style={{paddingBottom: "20px"}}>Topics</h2>                  
                  <section>
                    <h4 style={{paddingBottom: "20px"}}>NFL Week 17</h4>
                    <div>
                    <div className="metabet-gametile metabet-size-320x50 metabet-query-456967"></div>        
                    </div>                  
                  </section>
                  
            </div>
        </div>
      </Layout>
    )
  }
}

export default RootIndex

export const pageQuery = graphql`
  query IndexQuery {
    allCosmicjsPosts(sort: { fields: [created], order: DESC }, limit: 1000) {
      edges {
        node {
          metadata {
            description
            content
            headline
          }
          slug
          title
          created(formatString: "DD MMMM, YYYY")
        }
      }
    }
    cosmicjsSettings(slug: { eq: "general" }) {
      metadata {
        site_title
        author_name
        author_bio
        author_avatar {
          imgix_url
        }
      }
    }
  }
`
