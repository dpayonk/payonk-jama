module.exports = {
  plugins: [
    //`gatsby-plugin-offline`,
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
        trackingId: `UA-28160171-1`,
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
            'x-hasura-admin-secret': `${process.env.HASURA_SECRET}`
        },
      },
    },
    {
      resolve: "gatsby-source-graphql",
      options: {
        typeName: "backend",
        fieldName: "backend",
        url: `${process.env.BACKEND_ENDPOINT}`,
        // HTTP headers
        headers: {
            'x-hasura-admin-secret': `${process.env.HASURA_SECRET}`
        },
      },
    },
  ],
}
