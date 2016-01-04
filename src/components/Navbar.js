import React from 'react'

export default class Navbar extends React.Component {

  handleLogoutClick(e) {
    e.preventDefault()
    this.props.logout()
  }

  render() {
    let t = '#'
    let ctrl = ''

    if (this.props.auth) {
      t = <a href="#/">#</a>
      ctrl = (
        <div>
          <a className="octicon octicon-plus" href="#/a"></a>
          <a className="octicon octicon-sign-out" onClick={this.handleLogoutClick.bind(this)}></a>
        </div>
      )
    }

    return (
      <nav className="row x-bar">
        <div className="large-12 columns">
          <h1>{t}</h1>
          {ctrl}
        </div>
      </nav>
    )
  }
}
