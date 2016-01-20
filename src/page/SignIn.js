import React from 'react'

export default class SignIn extends React.Component {

  handleSubmit(e) {
    e.preventDefault()

    let name = this.refs.name.value
    let passwd = this.refs.passwd.value
    let iv = this.refs.iv.value
    this.props.login(name, passwd, iv)
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit.bind(this)}>
        <label>
          Name
          <input type="text" ref="name" />
        </label>
        <label>
          Password
          <input type="text" ref="passwd" />
        </label>
        <label>
          iv
          <input type="text" ref="iv" />
        </label>
        <button type="submit" className="button">Sign in</button>
      </form>
    )
  }
}
