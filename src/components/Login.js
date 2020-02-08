import React, { useState } from 'react'
import { readAsJson } from '../utils'

function Login({ dispatch }) {
  const [nameNode, setNameNode] = useState(null)
  const [passwdNode, setPasswdNode] = useState(null)

  async function handleLogin(e) {
    e.preventDefault()

    if (nameNode.value && passwdNode.value) {
      const user = await readAsJson({
        key: nameNode.value,
        passwd: passwdNode.value
      })
      if (user) {
        localStorage.user = JSON.stringify(user)
        dispatch({ type: 'SIGN_IN' })
        nameNode.value = ''
        window.location.href = '/'
      }
    }
  }

  return (
    <form onSubmit={handleLogin}>
      <input type="text" ref={setNameNode} />
      <input type="password" ref={setPasswdNode} />
      <input type="submit" className="button" value="登录" />
    </form>
  )
}

export default Login
