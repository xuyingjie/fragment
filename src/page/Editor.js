import React from 'react'
import InputFile from '../components/InputFile'
import { insertText } from '../utils/others'

export default class Editor extends React.Component {

  constructor(props) {
    super(props)
    this.state = { id: '', title: '', text: '' }
  }

  componentDidMount() {
    let id = location.hash.slice(4) ? location.hash.slice(4) : ''
    this.setState({id})
    if (id) {
      this.props.fragment.forEach(el => {
        if (id === el.id) {
          this.setState({title: el.title})
          this.setState({text: el.text})
        }
      })
    }
  }

  uploadSetToServer(e) {
    e.preventDefault()
    if (this.state.title) this.props.uploadSetToServer(this.state)
  }

  uploadFileSuccess(key, file) {
    let c = `\n![${file.name},${(file.size/1024).toFixed(2)}KB,${file.type},${key}]`

    let textarea = this.refs.content
    insertText(textarea, c)

    let section = this.state.section
    section.content = textarea.value
    this.setState({section: section})
  }

  render() {
    return (
      <form onSubmit={this.uploadSetToServer.bind(this)}>
        <input type="text" placeholder="key" ref="title" value={this.state.title}
          onChange={event => this.setState({title:event.target.value})} />
        <textarea rows="24" placeholder="value" ref="text" value={this.state.text}
          onChange={event => this.setState({text:event.target.value})} />
        <InputFile uploadFileSuccess={this.uploadFileSuccess.bind(this)} />
        <button type="submit" className="small button float-right">Save</button>
      </form>
    )
  }
}
