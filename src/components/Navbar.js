import React from 'react'


class Navbar extends React.Component {

  constructor(props) {
    super(props);
    // this.state.isDisplayed = false;
    this.state = {
      isDisplayed: false
    };

    this.toggleMenu = this.toggleMenu.bind(this);
  }

  toggleMenu() {
    console.log("Togg")
    this.setState({ isDisplayed: !this.state.isDisplayed });
  }

  render() {
    const isDisplayed = this.state.isDisplayed;

    return (
      <nav id="main-menu" style={{ width: '100%', background: 'transparent', zIndex: 1 }} className="navbar" role="navigation" aria-label="main navigation">
        <div className="navbar-brand">
          <a className="navbar-item" href="/" style={{ boxShadow: "none" }}>
            <img src="https://payonk.com/logo-payonk.png" height={42} />
          </a>
          <a onClick={this.toggleMenu} role="button"
            className="navbar-burger"
            aria-label="menu" aria-expanded="false" data-target="navbarBasicExample">
            <span aria-hidden="true" />
            <span aria-hidden="true" />
            <span aria-hidden="true" />
          </a>
        </div>
        <div id="navbarBasicExample" className={"navbar-menu " + (isDisplayed ? 'is-active' : '')}>
          <div className="navbar-start">
            <a href="/about" className="navbar-item" style={{ boxShadow: "none" }}>
              About
        </a>
            <a href="/blog" className="navbar-item" style={{ boxShadow: "none" }}>
              Blog
                </a>
            <a href="/eating" className="navbar-item" style={{ boxShadow: "none" }}>
              Eating
                </a>
          </div>
          <div className="navbar-end">
            <div className="navbar-item has-dropdown is-hoverable">
              <a className="navbar-link pull-right" style={{ boxShadow: "none" }}>
                More
                </a>
              <div className="navbar-dropdown">
                <a href="https://clique.payonk.com" className="navbar-item" style={{ boxShadow: "none" }}>
                  Clique
              <span style={{ display: 'inline-block', paddingLeft: '8px' }} className="icon is-small is-left">
                    <i className="fas fa-external-link-alt"></i>
                  </span>
                </a>
                <a href="https://irene.love" className="navbar-item" style={{ boxShadow: "none" }}>
                  Irene
              <span style={{ display: 'inline-block', paddingLeft: '8px' }} className="icon is-small is-left">
                    <i className="fas fa-external-link-alt"></i>
                  </span>

                </a>
                <hr className="navbar-divider" />
                <a href="/app/profile" className="navbar-item" style={{ boxShadow: "none" }}>
                  My Profile
            </a>

                <a href="mailto:us@payonk.com" subject="I would like to help" className="navbar-item"
                  style={{ boxShadow: "none" }}
                >
                  Report an issue
                  </a>
              </div>
            </div>
            <div className="navbar-item">
              <div className="buttons">
                <a href="/app/login" className="button is-light">
                  Log in
                  </a>
              </div>
            </div>
          </div>
        </div>
      </nav>
    )
  }
}

export default Navbar;