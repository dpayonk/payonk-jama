import React from 'react'
import { Link } from 'gatsby'
import { StaticQuery, graphql } from 'gatsby'

import { rhythm, scale } from '../utils/typography'
import get from 'lodash/get'

import Bio from '../components/Bio'

// Import typefaces
import 'typeface-montserrat'
import 'typeface-merriweather'

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

      if (location.pathname === rootPath) {
        header = (
          
          <div
            style={{
              backgroundColor: '#007ACC',
              backgroundImage: `url("${homgePageHero}?w=2000")`,
              backgroundSize: 'cover',
              backgroundPosition: 'right',
              width: '100%',
              height: rhythm(14),
              position: 'relative',
              marginBottom: `${rhythm(1.5)}`,
            }}
          >
            <nav style={{ position: 'absolute', width: '100%', zIndex: '1', padding: "0px 24px"}}>           
              <Link style={{fontSize: "4rem", color: "rgba(112,155,138)", textDecoration: "none"}} to="/">
              <img style={{maxWidth:"20vw"}} src={'/logo-payonk.png'} alt="Logo" />
              </Link>
                <div style={{display:"inline-block", margin:"0px 8vw 0px 16vw"}}>
                  
                </div>
          </nav>
          <div style={{background: 'rgba(112,155,138)', borderRadius: '16px 16px 0px 0px', 
          padding: '16px 2px 8px 16px', minHeight: '60px',
          float: "right", minWidth:"33vw", maxWidth:'30vw', position: 'fixed', left: '33vw', bottom: '0px'}}>
            <h5 style={{marginTop:"0px"}}>Apps</h5>
            <span>
                <a style={{fontSize: '2rem', color:'white'}} href="https://clique.payonk.com">Clique</a>  
            </span>
          </div>
          </div>
        )
      } else if (location.pathname === postsPath) {
        header = (
          
          <div
            style={{
              backgroundColor: '#007ACC',
              backgroundImage: `url("${homgePageHero}?w=2000")`,
              backgroundSize: 'cover',
              backgroundPosition: 'right',
              width: '100%',
              height: rhythm(14),
              position: 'relative',
              marginBottom: `${rhythm(1.5)}`,
            }}
          >
            <nav style={{background:"rgba(255,255,255,0.3)", position: 'absolute', width: '100%', zIndex: '1', padding: "0px 24px"}}>           
              <Link style={{fontSize: "4rem", color: "rgba(112,155,138)", textDecoration: "none"}} to="/">P</Link>
                <div style={{display:"inline-block", margin:"0px 8vw 0px 16vw"}}>
                  
                </div>
          </nav>
          
          </div>
        )

      } else {
        header = (
          <h3
            style={{
              fontFamily: 'Montserrat, sans-serif',
              marginTop: 0,
              marginBottom: rhythm(-1),
              marginLeft: 'auto',
              marginRight: 'auto',
              maxWidth: rhythm(24),
              paddingTop: `${rhythm(1.5)}`,
            }}
          >
            <Link
              style={{
                boxShadow: 'none',
                textDecoration: 'none',
                color: 'inherit',
              }}
              to={'/'}
            >
              {siteTitle}
            </Link>
          </h3>
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
              
              padding: `0 ${rhythm(3 / 4)} ${rhythm(1.5)} ${rhythm(3 / 4)}`,
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
