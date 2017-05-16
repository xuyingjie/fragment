import React from 'react'
import { downloadArrayBuffer } from '../utils'
import { site } from '../utils'

const HyperText = ({ file }) => {
  const { name, size, type, id } = file
  const isImg = type.match(/jpeg|icon|png|gif|svg/)

  async function download() {
    const res = await fetch(`${site}/assets/${id}`)
    const data = await res.arrayBuffer()
    downloadArrayBuffer({ name, type, data })
  }

  if (isImg) {
    return <img className="thumbnail" src={`${site}/assets/${id}`} alt={name} />
  } else {
    return (
      <p className="assets">
        <strong onClick={download}>{`${name} • ${size}`}</strong>
      </p>
    )
  }
}

export default HyperText
