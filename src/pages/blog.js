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
        <div className="main-content container columns">
          <div className="column is-two-thirds">
            <section> 
             
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
              </section>
          </div>
            <div className="column is-one-third pull-right">
                  <h2>Exclusive Content</h2>
                  <section>
                    <LoadableAuthForm />
                  </section>
            
                  <h2 style={{paddingBottom: "20px"}}>Interests</h2>       
                  {
                    labels.map((label) => {
                      return (<div style={{marginBottom: "3vh"}} key={label.slug}>
                         <Link style={{ boxShadow: 'none' }} to={`topics/${label.slug}`}>
                            <h3 style={{textTransform: "capitalize"}}>
                            {label.title}
                            </h3>
                          </Link>
                        <div style={{visibility: "hidden"}}>
                          Content related to the interest  
                        </div>
                      </div>)
                    })
                  }           
            </div>
        </div>
      </Layout>
    )
  }
}

export default RootIndex

export const pageQuery = graphql`
  query BlogQuery {
    allCosmicjsPosts(sort: { fields: [created], order: DESC }, limit: 1000) {
      edges {
        node {
          metadata {
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
