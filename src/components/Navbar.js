import React from 'react'

export default ({ settings }) => (  
        <nav id="main-menu" style={{width: '100%', background: 'transparent', zIndex: 1}} className="navbar" role="navigation" aria-label="main navigation">
          <div className="navbar-brand">
            <a className="navbar-item" href="/" style={{boxShadow: "none"}}>
              <img src="https://payonk.com/logo-payonk.png" height={42} />
            </a>
            <a role="button" className="navbar-burger" aria-label="menu" aria-expanded="false" data-target="navbarBasicExample">
              <span aria-hidden="true" />
              <span aria-hidden="true" />
              <span aria-hidden="true" />
            </a>
          </div>
          <div id="navbarBasicExample" className="navbar-menu">
            <div className="navbar-start">
                <a href="https://clique.payonk.com" className="navbar-item" style={{boxShadow: "none"}}>
                    Clique
                </a>
                <a href="https://irene.love" className="navbar-item" style={{boxShadow: "none"}}>
                    Irene
                </a>
            </div>
            <div className="navbar-end">
            <div className="navbar-item has-dropdown is-hoverable">
                <a className="navbar-link pull-right" style={{boxShadow: "none"}}>
                  More
                </a>
                <div className="navbar-dropdown">
                  <a href="/about" className="navbar-item" style={{boxShadow: "none"}}>
                    About
                  </a>
                  <hr className="navbar-divider" />
                  <a href="mailto:us@payonk.com" subject="I would like to help" className="navbar-item"
                  style={{boxShadow: "none"}}
                  >
                    Report an issue
                  </a>
                </div>
              </div>
              <div className="navbar-item">
                <div className="buttons">
                  <a href="https://clique.payonk.com/login/" className="button is-light">
                    Log in
                  </a>
                </div>
              </div>
            </div>
            </div>
        </nav>
      )
