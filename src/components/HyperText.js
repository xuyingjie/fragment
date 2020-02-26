import React, { useState, useEffect } from 'react'
import { get, attachmentsDir } from '../utils'
import { sha } from 'pessoa'

function HyperText({ info }) {
  const [name, size, type] = info.split(',')
  const [id, setId] = useState('')
  const [url, setUrl] = useState('')
  const [progressNode, setProgressNode] = useState(null)

  useEffect(() => {
    async function handleDate() {
      setId(await sha(info))
    }
    handleDate()
  }, [info])

  useEffect(() => {
    async function handleDate() {
      setUrl(await readAsBlobURL({ id, type }))
    }
    if (id && type.match(/image/)) {
      handleDate()
    }
  }, [id, type])

  if (type.match(/image/)) {
    return url && <img src={url} alt={name} />
  }
  // if (type.match(/video/)) {
  //   return url && <video src={url} controls />
  // }

  function onprogress(e) {
    if (e.lengthComputable) progressNode.style.width = (e.loaded === e.total) ? 0 : e.loaded / e.total * 100 + '%'
  }

  return (
    <p>
      <span className="assets">
        <strong onClick={() => download({ id, name, type, onprogress })}>{`${name} • ${size}`}</strong>
        <i className="progress" ref={setProgressNode}></i>
      </span>
    </p>
  )
}

async function readAsBlobURL({ id, type, onprogress }) {
  try {
    const data = await get({ key: `${attachmentsDir}/${id}`, responseType: 'arraybuffer', onprogress })
    const blob = new Blob([data], { type })
    return URL.createObjectURL(blob)
  } catch (e) {
    console.log(e)
    return ''
  }
}

async function download({ id, name, type, onprogress }) {
  try {
    const anchor = document.createElement('a')
    anchor.download = name
    anchor.href = await readAsBlobURL({ id, type, onprogress })
    // anchor.target = '_blank'
    document.body.appendChild(anchor)

    const evt = document.createEvent('MouseEvents')
    evt.initEvent('click', true, true)
    anchor.dispatchEvent(evt)
    document.body.removeChild(anchor)
  } catch (e) {
    console.log(e)
  }
}

export default HyperText
