import React from 'react'
import { Link } from 'gatsby'
import { StaticQuery, graphql } from 'gatsby'

// import { rhythm, scale } from '../utils/typography'
import get from 'lodash/get'

import Bio from '../components/Bio'
import Navbar from '../components/Navbar'

// Import typefaces
// import 'typeface-montserrat'
// import 'typeface-merriweather'

export default ({ children, location }) => (
  <StaticQuery
    query={graphql`
      query LayoutQuery {
        cosmicjsSettings(slug: { eq: "general" }) {
          metadata {
            site_heading
            site_title
            author_name
            author_bio
            author_avatar { 
              imgix_url
            }
            homepage_hero {
              imgix_url
            }
          }
        }
      }
    `}
    render={data => {
      const siteTitle = data.cosmicjsSettings.metadata.site_heading
      
      const author = get(this, 'props.data.cosmicjsSettings.metadata')

      const homgePageHero =
        data.cosmicjsSettings.metadata.homepage_hero.imgix_url
      let header

      let rootPath = `/`
      let postsPath = `/posts`
      if (typeof __PREFIX_PATHS__ !== `undefined` && __PREFIX_PATHS__) {
        rootPath = __PATH_PREFIX__ + `/`
        postsPath = __PATH_PREFIX__ + `/posts`
      }

      if (location !== undefined && location.pathname === rootPath) {
        header = (
          <div>
            <Navbar />
          <section style={{marginTop: "-71px"}} className="hero">
            <div className="hero-body" style={{backgroundImage: 'url("https://imgix.cosmicjs.com/d8ce4010-39c8-11eb-9ccb-e16da6a16ff7-EFFECTS.jpg?w=2000")', backgroundSize: 'cover', backgroundPosition: 'right', width: '100%', height: '24.5rem', position: 'relative', marginBottom: '2.625rem'}}>
           
          </div>
          </section>
            
          </div>
        )
      // } else if (location.pathname === postsPath) {
      //   header = (
      //     <div>
      //       <Navbar />
      //       <section className="hero">
      //         <div className="hero-body" 
      //           style={{
      //             backgroundColor: '#007ACC',
      //             backgroundImage: `url("${homgePageHero}?w=2000")`,
      //             backgroundSize: 'cover',
      //             backgroundPosition: 'right',
      //             width: '100%',
      //             position: 'relative',
      //           }}>
      //       </div>
      //       </section>
      //     </div>
      //   )

      } else {
        header = (
          <div>
            <Navbar />
          </div>
        )
      }
      return (
        <div>
          {header}
          <div
            style={{
              minWidth: '75vw',
              maxWidth: '75vw',
              marginLeft: 'auto',
              marginRight: 'auto',
              minHeight: 'calc(100vh - 42px)',
            }}
          >
              {children}
          </div>
          <footer
            style={{
              textAlign: 'center',
              padding: `0 20px 80px 0`,
            }}
          >
            
          </footer>
        </div>
      )
    }}
  />
)
