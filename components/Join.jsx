import React from 'react'
import {upload} from '../tools'

export default class Join extends React.Component {

  handleSubmit(e) {
    e.preventDefault()

    var name = this.refs.name.value
    var secret = this.refs.secret.value
    var passwd = this.refs.passwd.value
    var AK = this.refs.AK.value
    var SK = this.refs.SK.value

    var user = {AK, SK, passwd}
    localStorage.user = JSON.stringify(user)

    upload(name, user, {passwd:secret}).then(() => {
      console.log('success')
    })
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit.bind(this)}>
        <label>
          Name
          <input type="text" ref="name"/>
        </label>
        <label>
          Password
          <input type="text" ref="secret"/>
        </label>
        <label>
          Random Password
          <input type="text" ref="passwd"/>
        </label>
        <label>
          AK
          <input type="text" ref="AK"/>
        </label>
        <label>
          SK
          <input type="text" ref="SK"/>
        </label>
        <input type="submit" value="注册" />
      </form>
    )
  }
}
