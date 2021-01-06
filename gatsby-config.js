module.exports = {
  plugins: [
    `gatsby-plugin-offline`,
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/src/pages`,
        name: 'pages',
      },
    },
    {
      resolve: 'gatsby-source-cosmicjs',
      options: {
        bucketSlug: process.env.COSMIC_BUCKET,
        objectTypes: ['posts','settings', 'recipes'],
        apiAccess: {
          read_key: process.env.COSMIC_READ_KEY,
        }
      }
    },
    {
      resolve: `gatsby-plugin-google-analytics`,
      options: {
        //trackingId: `ADD YOUR TRACKING ID HERE`,
      },
    },
    {
      resolve: 'gatsby-plugin-typography',
      options: {
        pathToConfigModule: 'src/utils/typography',
      },
    },
    {
      resolve: "gatsby-source-graphql",
      options: {
        typeName: "whealthy",
        fieldName: "whealthy",
        url: "https://api.whealthy.us/v1/graphql",
        // HTTP headers
        headers: {
          // Learn about environment variables: https://gatsby.dev/env-vars
//          Authorization: `Bearer ${process.env.HASURA_ADMIN_TOKEN}`,
            'x-hasura-admin-secret': `${process.env.HASURA_ADMIN_TOKEN}`
        },
        // // HTTP headers alternatively accepts a function (allows async)
        // headers: async () => {
        //   return {
        //     Authorization: await getAuthorizationToken(),
        //   }
        // },
        // Additional options to pass to node-fetch
        // fetchOptions: {},
      },
    },
  ],
}
