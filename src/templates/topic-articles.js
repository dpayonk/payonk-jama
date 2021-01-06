
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
    console.log("YHO: ");
    const list = get(this, 'props.data.whealthy.getObject')
    console.log(list);
    return (
      <Layout location={location}>
        <Helmet title={siteTitle} />
        <section style={{ marginTop: "20vh" }}>
          <h1 style={{ paddingBottom: "3vh" }}>What's in our pantry</h1>
        </section>
        <section>
          <h2>{list.title}</h2>
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
