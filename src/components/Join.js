import React, { useState } from 'react'
import { sha, stringToArrayBuffer } from 'pessoa'
import { put } from '../utils'

function Join() {
  const [nameNode, setNameNode] = useState(null)
  const [passwdNode, setPasswdNode] = useState(null)
  const [accessKeyIdNode, setAccessKeyIdNode] = useState(null)
  const [accessKeySecretNode, setAccessKeySecretNode] = useState(null)
  const [cryptoKeyNode, setCryptoKeyNode] = useState(null)

  async function handleSubmit(e) {
    e.preventDefault()

    const user = {
      accessKeyId: accessKeyIdNode.value,
      accessKeySecret: accessKeySecretNode.value,
      cryptoKey: cryptoKeyNode.value,
    }
    const data = stringToArrayBuffer(JSON.stringify(user))
    localStorage.a = new Uint8Array(data)

    const status = await put({
      key: `home/${await sha(nameNode.value, 'SHA-256')}`,
      data,
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
      <label>AccessKeyId
        <input type="text" ref={setAccessKeyIdNode} />
      </label>
      <label>AccessKeySecret
        <input type="text" ref={setAccessKeySecretNode} />
      </label>
      <label>CryptoKey
        <input type="text" ref={setCryptoKeyNode} />
      </label>
      <input type="submit" className="button" value="注册" />
    </form>
  )
}

export default Join
