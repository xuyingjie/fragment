import React, { useState, useEffect } from 'react'
import { usePaper } from '../reducer'

import { readAsArrayBuffer } from '../utils'
import { uploadFile } from '../utils'

function Edit(props) {
  // const { state, dispatch } = useContext(Context)
  const { state, dispatch } = props
  const [titleNode, setTitleNode] = useState(null)
  const [textNode, setTextNode] = useState(null)
  const [progressNode, setProgressNode] = useState(null)

  const paper = usePaper(props.id)
  useEffect(() => {
    if (paper.id) {
      titleNode.value = paper.title
      textNode.value = paper.text
    }
  }, [paper, titleNode, textNode])

  async function handleSave(e) {
    e.preventDefault()

    if (titleNode.value) {
      await addPaper({
        id: paper.id || Date.now(),
        title: titleNode.value,
        text: textNode.value,
        last: Date.now()
      })
    }
  }

  async function addPaper(paper) {
    await uploadFile({
      key: `paper/${paper.id}`,
      data: paper
    })

    let list = state.list
    const { id, title, last } = paper

    if (!props.id) {
      list = [{ id, title, last }, ...list]
    } else {
      list = list.map(item => {
        if (item.id === id) {
          return { id, title, last }
        } else {
          return item
        }
      })
    }
    const status = await uploadFile({
      key: 'list',
      data: list
    })

    if (status) {
      dispatch({
        type: 'INIT_LIST',
        list
      })
      window.location.href = '/'
    }
  }

  function handleFileChange(e) {
    const files = e.target.files
    const readAndUpload = async (file, index) => {
      const id = Date.now() + index
      const data = await readAsArrayBuffer(file)

      const status = await uploadFile({
        key: `assets/${id}`,
        data,
        progressNode
      })
      if (status) {
        const str = `\n![${file.name},${(file.size / 1024).toFixed(2)}KB,${file.type},${id}]`
        textNode.value += str
      }
    }
    if (files.length) {
      [...files].forEach(readAndUpload)
    }
  }

  return (
    <form onSubmit={handleSave}>
      <input type="text" ref={setTitleNode} />
      <textarea ref={setTextNode} />
      <label className="upload">
        <input type="file" multiple onChange={handleFileChange} />
        <i className="progress" ref={setProgressNode}></i>
      </label>
      <input type="submit" className="button" value="保存" />
    </form>
  )
}

export default Edit
