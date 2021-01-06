
import React from 'react'
import { Link } from 'gatsby'
import get from 'lodash/get'
import Helmet from 'react-helmet'
import { graphql } from 'gatsby'

import Layout from '../components/layout'


class TopicsIndexTemplate extends React.Component {
  render() {

    const siteTitle = "Recipes"
    const location = "pantry"
    //const location = get(this, 'props.location')

    const list = get(this, 'props.data.whealthy.getObject')

    return (
      <Layout location={location}>
        <Helmet title={siteTitle} />      
        <section style={{ marginTop: "20vh" }}>
          <h2 style={{paddingBottom: "20px", textTransform: "capitalize"}}>{list.title}</h2>
          <p dangerouslySetInnerHTML={{ __html: list.content}} />

        </section>
      </Layout>
    )
  }
}

export default TopicsIndexTemplate

export const pageQuery = graphql`
query FindLabelsBySlug($slug: String!) {
  whealthy {
    getObject(bucket_slug: "payonk-jama", input: {slug: $slug}) {
      _id
      content
      created_at
      created_by
      locale
      metadata
      modified_at
      modified_by
      order
      published_at
      slug
      status
      title
      type_slug
    }
  }
}

`
