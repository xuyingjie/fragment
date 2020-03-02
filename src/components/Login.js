import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { sha } from 'pessoa'
import { get } from '../utils'

function Login(props) {
  const navigate = useNavigate()
  const [nameNode, setNameNode] = useState(null)
  const [passwdNode, setPasswdNode] = useState(null)

  async function handleLogin(e) {
    e.preventDefault()

    if (nameNode.value && passwdNode.value) {
      const data = await get({
        key: `home/${await sha(nameNode.value, 'SHA-256')}`,
        passwd: passwdNode.value,
      })
      if (data.byteLength) {
        localStorage.a = new Uint8Array(data)
        nameNode.value = ''
        props.setAuth(true)
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
