const each = require('lodash/each')
const Promise = require('bluebird')
const path = require('path')

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions
  const indexPage = path.resolve('./src/pages/index.js')
  // const recipePage = path.resolve('./src/pages/index.js')
  // Apparently, it will create index by default as well
  // as anything in src/pages/* as static pages
  
  const topicArticles = path.resolve('./src/templates/topic-articles.js')
  await graphql(`
      query FindAllLabels {
        whealthy {
          getObjects(bucket_slug: "payonk-jama", input: {type: "labels"}) {
            objects {        
              slug
            }
          }
        }
      }
      `
  ).then(result => {
    if (result.errors) {
      console.log(result.errors)
      reject(result.errors)
    }

    const topics = result.data.whealthy.getObjects.objects;

    each(topics, (topic) => {

      createPage({
        path: `topics/${topic.slug}`,
        component: topicArticles,
        context: {
          slug: topic.slug,
        },
      })
    })
  })

  const postRoot = 'blog';

  // createPage({
  //   path: postRoot,
  //   component: indexPage,
  // })
  const blogPost = path.resolve('./src/templates/blog-post.js')
  await graphql(
    `
        {
          allCosmicjsPosts(sort: { fields: [created], order: DESC }, limit: 1000) {
            edges {
              node {
                slug,
                title
              }
            }
          }
        }
      `
  ).then(result => {
    if (result.errors) {
      console.log(result.errors)
      reject(result.errors)
    }
    console.log("Got here----");
    // Create blog posts pages.
    const posts = result.data.allCosmicjsPosts.edges;

    each(posts, (post, index) => {
      const next = index === posts.length - 1 ? null : posts[index + 1].node;
      const previous = index === 0 ? null : posts[index - 1].node;

      createPage({
        path: `${postRoot}/${post.node.slug}`,
        component: blogPost,
        context: {
          slug: post.node.slug,
          previous,
          next,
        },
      })
    })
  });


  return new Promise((resolve, reject) => {
    const recipePost = path.resolve('./src/templates/recipe-post.js')

    resolve(
      graphql(
        `
          {
            allCosmicjsRecipes(sort: { fields: [created], order: DESC }, limit: 1000) {
              edges {
                node {
                  slug,
                  title
                }
              }
            }
          }
        `
      ).then(result => {
        if (result.errors) {
          console.log(result.errors)
          reject(result.errors)
        }

        // Create recipes posts pages.
        const recipes = result.data.allCosmicjsRecipes.edges;

        each(recipes, (recipe, index) => {
          const next = index === recipes.length - 1 ? null : recipes[index + 1].node;
          const previous = index === 0 ? null : recipes[index - 1].node;

          createPage({
            path: `recipes/${recipe.node.slug}`,
            component: recipePost,
            context: {
              slug: recipe.node.slug,
              previous,
              next,
            },
          })
        })
      })
    )

  })
}

// Implement the Gatsby API “onCreatePage”. This is
// called after every page is created.
exports.onCreatePage = async ({ page, actions }) => {
  const { createPage } = actions
  // Only update the `/app` page.
  if (page.path.match(/^\/app/)) {
    // page.matchPath is a special key that's used for matching pages
    // with corresponding routes only on the client.
    page.matchPath = "/app/*"
    // Update the page.
    createPage(page)
  }
}