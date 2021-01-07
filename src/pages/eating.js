import React from 'react'
import { Link } from 'gatsby'
import get from 'lodash/get'
import Helmet from 'react-helmet'
import { graphql } from 'gatsby'
import headline from '../../static/family-recipes-headline.jpg'

import Layout from '../components/layout'


class RecipeIndex extends React.Component {
  render() {
    // const siteTitle = get(
    //   this,
    //   'props.data.cosmicjsSettings.metadata.site_title'
    // )
    const siteTitle = "Recipes"
    const location = 'eating'; // get(this, 'props.location')
    const recipes = get(this, 'props.data.allCosmicjsRecipes.edges')

    return (
      <Layout location={location}>
        <Helmet title={siteTitle} />
        <div className="main-content container columns is-centered">
          <div style={{textAlign: "center"}} className="column is-full">
            <h1 style={{ paddingBottom: "3vh" }}>Family recipes we've created and inherited over the years</h1>            
            <img className="feature-square-image" src={headline} />
          </div>
        </div>
        <div className="container columns">
          <div className="column is-three-fifths" >
            <h2>Recent Recipes</h2>
            {recipes.map(({ node }) => {
              const title = get(node, 'title') || node.slug
              return (
                <div style={{ paddingTop: "1.5rem" }} key={node.slug}>
                  <h3>
                    <Link style={{ boxShadow: 'none' }} to={`recipes/${node.slug}`}>
                      {title}
                    </Link>
                  </h3>
                  <small>{node.created}</small>
                </div>
              )
            })}

          </div>
          <div className="column is-two-fifths">
            
          </div>
        </div>
        <div className="container columns">
          
        </div>
      </Layout>
    )
  }
}

export default RecipeIndex

export const pageQuery = graphql`
{
  allCosmicjsRecipes(sort: { fields: [created], order: DESC }, limit: 1000) {
        edges {
          node {
            slug
            content
            title
            created(formatString: "DD MMMM, YYYY")
          }
        }
      }
  }
`