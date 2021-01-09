import React from 'react'
import { Link } from 'gatsby'
import get from 'lodash/get'
import Helmet from 'react-helmet'
import { graphql } from 'gatsby'

import Layout from '../components/layout'
import { rhythm, scale } from '../utils/typography'

import {LoadableAuthForm} from '../app/client_library'

class RootIndex extends React.Component {
  render() {
    const siteTitle = get(
      this,
      'props.data.cosmicjsSettings.metadata.site_title'
    )
    const posts = get(this, 'props.data.allCosmicjsPosts.edges')
    const labels = get(this, 'props.data.whealthy.getObjects.objects')
    const location = get(this, 'props.location')

    return (
      <Layout location={location}>
        <Helmet title={siteTitle} />
        <div className="container columns">
          <div className="column is-two-thirds">
            <section> 
              <section>
                <h2>Check out updates of our family!</h2>
                  <LoadableAuthForm />
              </section>
                
              </section>
          </div>
            <div className="column is-one-third pull-right">
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
                      <Link style={{ boxShadow: 'none' }} to={`blog/${node.slug}`}>
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

    whealthy {
 
      getObjects(bucket_slug: "payonk-jama", input: {
        limit: 20,
        read_key: "",
        type: "labels"
      }) {
        objects {
          slug
          title
          content
        }
      }
    }
    

  }
`
