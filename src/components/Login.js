import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { get } from '../utils'

function Login({ dispatch }) {
  const navigate = useNavigate()
  const [nameNode, setNameNode] = useState(null)
  const [passwdNode, setPasswdNode] = useState(null)

  async function handleLogin(e) {
    e.preventDefault()

    if (nameNode.value && passwdNode.value) {
      const user = await get({
        key: nameNode.value,
        passwd: passwdNode.value
      })
      if (user) {
        localStorage.user = JSON.stringify(user)
        nameNode.value = ''
        dispatch({ type: 'SIGN_IN' })
        navigate('/')
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
