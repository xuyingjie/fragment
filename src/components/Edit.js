import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { usePost } from '../reducer'

import { createId, put, postsDir, attachmentsDir } from '../utils'
import { sha } from 'pessoa'

function Edit() {
  // const { state, dispatch } = useContext(Context)
  const { id } = useParams()
  const navigate = useNavigate()

  const [titleNode, setTitleNode] = useState(null)
  const [textNode, setTextNode] = useState(null)
  const [progressNode, setProgressNode] = useState(null)

  const paper = usePost(id)
  useEffect(() => {
    if (textNode && paper.text !== undefined) {
      titleNode.value = paper.title
      textNode.value = paper.text
    }
  }, [paper, titleNode, textNode])

  async function handleSave(e) {
    e.preventDefault()

    const theId = id || await createId(`${Date.now()}${titleNode.value}`)
    const status = await put({
      key: `${postsDir}/${theId}`,
      data: {
        text: textNode.value,
        last: Date.now(),
      }
    })

    if (status) {
      navigate(`/${theId}`)
    }
  }

  function handleFileChange(e) {
    const files = e.target.files
    const readAndUpload = async (file) => {
      const info = `${file.name.trim()},${(file.size / 1024).toFixed(2)}KB,${file.type}`
      const id = await sha(info)
      const data = await readAsArrayBuffer(file)

      const status = await put({
        key: `${attachmentsDir}/${id}`,
        data,
        onprogress: (e) => {
          if (e.lengthComputable) progressNode.style.width = (e.loaded === e.total) ? 0 : e.loaded / e.total * 100 + '%'
        }
      })
      if (status) {
        textNode.value += `\n![${info}]`
      }
    }
    if (files.length) {
      [...files].forEach(readAndUpload)
    }
  }

  return (
    <form onSubmit={handleSave}>
      <input type="text" ref={setTitleNode} readOnly={Boolean(id)} />
      <textarea ref={setTextNode} />
      <label className="upload">
        <input type="file" multiple onChange={handleFileChange} />
        <i className="progress" ref={setProgressNode}></i>
      </label>
      <input type="submit" className="button" value="保存" />
    </form>
  )
}

function readAsArrayBuffer(file) {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onload = () => {
      resolve(reader.result)
    }
    reader.readAsArrayBuffer(file)
  })
}

export default Edit
