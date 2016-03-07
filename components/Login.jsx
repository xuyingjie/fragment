import React from 'react'

export default React.createClass({
  handleLogin(e) {
    e.preventDefault()
    var name = this.refs.name.value
    var passwd = this.refs.passwd.value
    if (name && passwd) {
      this.props.login(name, passwd)
    }
  },

  render() {
    return <form onSubmit={this.handleLogin}>
      <input type="text" ref="name" />
      <input type="password" ref="passwd" />
      <input type="submit" value="LOGIN" />
    </form>
  }
})
