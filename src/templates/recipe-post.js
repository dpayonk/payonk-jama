import React from 'react'
import Helmet from 'react-helmet'
import { Link } from 'gatsby'
import get from 'lodash/get' // what does lodash get to get data
import { graphql } from 'gatsby'

// import Bio from '../components/Bio'
import Layout from '../components/layout'


class RecipePostTemplate extends React.Component {
  render() {
    const recipe = this.props.data.cosmicjsRecipes
    const siteTitle = get(
      this.props,
      'data.cosmicjsSettings.metadata.site_title'
    )

    const author = get(this, 'props.data.cosmicjsSettings.metadata')
    const location = get(this, 'props.location')
    const { previous, next } = this.props.pageContext

    return (
      <Layout location={location}>
        
        <Helmet title={`${recipe.title} | ${siteTitle}`} />
        <div>
          <Link to="/recipes">← Back to Recipes</Link>
        </div>
        <h1
          style={{            
            marginBottom: "2rem",
            fontSize: "3rem"
          }}
        >
          {recipe.title}
        </h1>
        <p
          style={{            
            display: 'block',
            marginBottom: '2vh',
            marginTop: '2vh',
          }}
        >
          {recipe.created}
        </p>
        <div
          className="post-hero"
          style={{
            backgroundColor: '#007ACC',
            backgroundImage: `url("${recipe.metadata.hero.imgix_url}?w=2000")`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            marginBottom: '2vh',
            position: 'relative',
          }}
        />
        <img style={{maxWidth: "50vw"}} src={recipe.metadata.hero.imgix_url} />
        <div
          className="post-content" style={{marginTop: "80px"}}
          dangerouslySetInnerHTML={{ __html: recipe.content }}
        />        
        <hr
          style={{
            marginBottom: '2vh'
          }}
        />

        <ul
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            listStyle: 'none',
            padding: 0,
          }}
        >
          {previous && (
            <li>
              <Link to={`posts/${previous.slug}`} rel="prev">
                ← {previous.title}
              </Link>
            </li>
          )}

          {next && (
            <li>
              <Link to={`recipes/${next.slug}`} rel="next">
                {next.title} →
              </Link>
            </li>
          )}
        </ul>
      </Layout>
    )
  }
}

export default RecipePostTemplate

export const pageQuery = graphql`
  query RecipePostBySlug($slug: String!) {
    cosmicjsRecipes(slug: { eq: $slug }) {
      id
      content
      title
      created(formatString: "MMMM DD, YYYY")
      metadata {
        hero {
          imgix_url
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
