import React from 'react'
import { uploadFile } from '../utils/cos'

let Join = () => {
  let name, passwd, appid, sid, skey

  async function handleSubmit(e) {
    e.preventDefault()

    let user = {
      appid: appid.value,
      sid: sid.value,
      skey: skey.value
    }

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
      <label>Appid
        <input type="text" ref={node => { appid = node }} />
      </label>
      <label>Sid
        <input type="text" ref={node => { sid = node }} />
      </label>
      <label>Skey
        <input type="text" ref={node => { skey = node }} />
      </label>
      <input type="submit" className="button" value="注册" />
    </form>
  )
}

export default Join
