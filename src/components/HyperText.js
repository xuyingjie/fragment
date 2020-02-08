import React, { useState, useEffect } from 'react'
import { readAsBlobURL, download } from '../utils'
import { CDN_DOMAIN } from '../utils/oss'

function HyperText({ file }) {
  const { name, size, type, id } = file
  const url = `${CDN_DOMAIN}/assets/${id}`
  const [blobURL, setBlobURL] = useState('')
  const [progressNode, setProgressNode] = useState(null)

  useEffect(() => {
    async function handleDate() {
      // 设置正确的type信息
      setBlobURL(await readAsBlobURL({ url, type }))
    }
    if (type.match(/image/)) {
      handleDate()
    }
  }, [url, type])

  if (type.match(/image/)) {
    return blobURL && <img src={blobURL} alt={name} />
  }
  if (type.match(/video/)) {
    return <video src={url} controls preload="none" />
  }
  return (
    <p>
      <span className="assets">
        <strong onClick={() => download({ url, name, type, progressNode })}>{`${name} • ${size}`}</strong>
        <i className="progress" ref={setProgressNode}></i>
      </span>
    </p>
  )
}

export default HyperText
