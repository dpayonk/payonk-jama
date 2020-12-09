# Payonk static site

The payonk site lists interesting blog posts, announcements, and updates in a non vendor locked in way.

## Architecture Overview

This site uses gatsbyjs framework to compile templates located in /src with data from a headless CMS (using cosmicJS)

## Configurations

This uses a digital ocean buildpack

#### Environment Variables

COSMIC_BUCKET - > payonk-jama
COSMIC_READ_KEY -> *** secret loaded via environment variables

#### Files

gatsby-config.js
```
 bucketSlug: process.env.COSMIC_BUCKET,
        objectTypes: ['posts','settings'],
        apiAccess: {
          read_key: process.env.COSMIC_READ_KEY,
        }
```

## Develop

#### Install

``` bash
# Make sure that you have the Gatsby CLI program installed
npm install --global gatsby-cli
```

#### Running

``` bash
# Then you can run it by
npm run develop
```
