
import React from 'react'
import { Link } from 'gatsby'
import get from 'lodash/get'
import Helmet from 'react-helmet'
import { graphql } from 'gatsby'

import Layout from '../components/layout'


class SportsIndex extends React.Component {
  render() {
    // const siteTitle = get(
    //   this,
    //   'props.data.cosmicjsSettings.metadata.site_title'
    // )
    const siteTitle = "Recipes"
    const location = "pantry"
    //const location = get(this, 'props.location')
    console.log("YHO: ");
    const list = get(this, 'props.data.whealthy.food_item')
    console.log(list);
    return (
      <Layout location={location}>
        <Helmet title={siteTitle} />       
        <section style={{marginTop: "20vh"}}>
        <h1 style={{paddingBottom: "3vh"}}>What's in our pantry</h1>
        </section>
        <section> 
                <h2>In our pantry</h2>
              
                  {list.map(( node ) => {
                    const title = get(node, 'title')

                    return (
                      <div style={{ paddingTop: "1.5rem" }} key={node.id}>
                        <h3>
                          <Link style={{ boxShadow: 'none' }} to={`pantry/${node.id}`}>
                            {title}
                          </Link>
                        </h3>
                      </div>
                    )
                  })}

              </section>        
      </Layout>
    )
  }
}

export default SportsIndex

export const pageQuery = graphql`
query SportsQuery {
  whealthy {
    food_item {
      id
      image_url
      description
      title
    }
  }
}

`
