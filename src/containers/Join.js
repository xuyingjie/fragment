import React from 'react'
import { uploadFile } from '../utils'

let Join = () => {
  let name, passwd, accessKeyId, accessKeySecret
  // let key

  async function handleSubmit(e) {
    e.preventDefault()

    let user = {
      // key: key.value,
      accessKeyId: accessKeyId.value,
      accessKeySecret: accessKeySecret.value
    }

    localStorage.user = JSON.stringify(user)
    const status = await uploadFile({
      filepath: name.value,
      data: user,
      passwd: passwd.value
    })
    name.value = JSON.stringify(status)
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>Name
        <input type="text" ref={node => { name = node }} />
      </label>
      <label>Password
        <input type="text" ref={node => { passwd = node }} />
      </label>
      <label>AccessKey ID
        <input type="text" ref={node => { accessKeyId = node }} />
      </label>
      <label>AccessKey Secret
        <input type="text" ref={node => { accessKeySecret = node }} />
      </label>
      {/* <label>Random 16 bytes Key
        <input type="text" ref={node => { key = node }} placeholder="openssl rand -base64 12" />
      </label> */}
      <input type="submit" className="button" value="注册" />
    </form>
  )
}

export default Join
