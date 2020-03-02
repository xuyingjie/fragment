import React, { useState, useEffect } from 'react'
import { readAsBlobURL } from '../../utils/file'

function HyperText({ item }) {
  const { key, name, type } = item
  const [url, setUrl] = useState('')

  useEffect(() => {
    async function fetchData() {
      setUrl(await readAsBlobURL({ key, type }))
    }
    fetchData()
  }, [key, type])

  if (url) {
    if (type.match(/image/)) {
      return <img src={url} alt={name} />
    }
    if (type.match(/video/)) {
      return <video src={url} controls />
    }
  }
  return null
}

export default HyperText
