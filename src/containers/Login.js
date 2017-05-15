import React from 'react'
import { connect } from 'react-redux'
import { login } from '../actions/sign'

let Login = ({ dispatch }) => {
  let name, passwd

  async function handleLogin(e) {
    e.preventDefault()

    if (name.value && passwd.value) {
      const status = await dispatch(login(name.value, passwd.value))
      if (status) {
        // name.value = ''
        // passwd.value = ''
        location.href = '#/'
      }
    }
  }

  return (
    <form onSubmit={handleLogin}>
      <input type="text" ref={node => { name = node }} />
      <input type="password" ref={node => { passwd = node }} />
      <input type="submit" className="button" value="登录" />
    </form>
  )
}

Login = connect()(Login)

export default Login
