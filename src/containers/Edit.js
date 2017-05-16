import React from 'react'
import { connect } from 'react-redux'
import { addPaper } from '../actions'
import { readAsArrayBuffer } from '../utils'
import { uploadFile } from '../utils'

class Edit extends React.Component {

  constructor(props) {
    super(props)
    this.state = { id: 0 }

    this.handleSave = this.handleSave.bind(this)
    this.handleFileChange = this.handleFileChange.bind(this)
  }

  componentDidMount() {
    const paper = this.props.paper
    if (paper) {
      const { id, title, text } = paper
      this.title.value = title
      this.text.value = text
      this.setState({ id })
    }
  }

  async handleSave(e) {
    e.preventDefault()

    if (this.title.value) {
      let isNew, id
      if (this.state.id) {
        isNew = false
        id = this.state.id
      } else {
        isNew = true
        id = Date.now()
      }
      const status = await this.props.dispatch(addPaper({
        id,
        title: this.title.value,
        text: this.text.value,
        last: Date.now()
      }, isNew))

      if (status) {
        location.href = '#/'
      }
    }
  }

  handleFileChange(e) {
    const files = e.target.files
    const readAndUpload = async (file, index) => {
      const id = Date.now() + index
      const data = await readAsArrayBuffer(file)

      const status = await uploadFile({
        filepath: `assets/${id}`,
        data
      })
      if (status.code === 0) {
        const str = `\n![${file.name},${(file.size / 1024).toFixed(2)}KB,${file.type},${id}]`
        this.text.value = this.text.value + str
      }
    }
    if (files.length) {
      [...files].forEach(readAndUpload)
    }
  }

  render() {
    return (
      <form onSubmit={this.handleSave}>
        <input type="text" ref={node => { this.title = node }} />
        <textarea ref={node => { this.text = node }} />
        <input type="file" multiple onChange={this.handleFileChange} />
        <input type="submit" className="button" value="保存" />
      </form>
    )
  }
}

const EditContainer = connect()(Edit)

export default EditContainer
