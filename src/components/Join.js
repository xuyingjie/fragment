import React, { useState } from 'react'
import { put } from '../utils'

function Join() {
  const [nameNode, setNameNode] = useState(null)
  const [passwdNode, setPasswdNode] = useState(null)
  const [keyNode, setKeyNode] = useState(null)
  const [accessKeyIdNode, setAccessKeyIdNode] = useState(null)
  const [accessKeySecretNode, setAccessKeySecretNode] = useState(null)

  async function handleSubmit(e) {
    e.preventDefault()

    const user = {
      key: keyNode.value,
      accessKeyId: accessKeyIdNode.value,
      accessKeySecret: accessKeySecretNode.value
    }

    localStorage.user = JSON.stringify(user)
    const status = await put({
      key: nameNode.value,
      data: user,
      passwd: passwdNode.value
    })
    accessKeySecretNode.value = status
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>Name
        <input type="text" ref={setNameNode} />
      </label>
      <label>Password
        <input type="text" ref={setPasswdNode} />
      </label>
      <label>Key
        <input type="text" ref={setKeyNode} />
      </label>
      <label>AccessKeyId
        <input type="text" ref={setAccessKeyIdNode} />
      </label>
      <label>AccessKeySecret
        <input type="text" ref={setAccessKeySecretNode} />
      </label>
      <input type="submit" className="button" value="注册" />
    </form>
  )
}

export default Join
