import React from 'react'
import {upload} from '../tools'

class Editor extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      item: {id: 0, title: '', text: '', lastChange: 0}
    }
    this.itemChange = this.itemChange.bind(this)
    this.fileChange = this.fileChange.bind(this)
    this.handleSave = this.handleSave.bind(this)
  }

  itemChange(obj) {
    var item = Object.assign({}, this.state.item, obj)
    this.setState({item})
  }

  fileChange(event) {
    var files = event.target.files

    var readAndUpload = (file, index) => {
      var id = Date.now() + index
      var reader = new FileReader()
      reader.onload = () => {
        upload(`file/${id}`, reader.result, {file:true}).then(() => {
          var c = `\n![${file.name},${(file.size/1024).toFixed(2)}KB,${file.type},${id}]`
          this.itemChange({text: this.state.item.text + c})
        })
      }
      reader.readAsArrayBuffer(file)
    }

    if (files.length > 0) {
      [...files].forEach(readAndUpload)
    }
  }

  handleSave(e) {
    e.preventDefault()
    if (this.state.item.title) {
      this.erase(this.props.item.text, this.state.item.text)
      this.props.save(this.state.item)
    }
  }

  erase(pre, next) {
    var p = pre.match(/\d{13}(?=])/g)
    if (p) {
      var n = next.match(/\d{13}(?=])/g)

      // _.difference(array, [values])
      var hasId = (id) => {
        var out = true
        if (n) {
          n.forEach(el => {
            if (el === id) out = false
          })
        }
        return out
      }
      var d = p.filter(hasId)

      if (d.length > 0) {
        d.forEach(id => {
          upload(`file/${id}`, {}).then(() => {
            console.log(`erase ${id}`)
          })
        })
      }
    }
  }

  componentDidMount() {
    this.setState({item: this.props.item})
  }

  componentWillReceiveProps(nextProps) {
    this.setState({item: nextProps.item})
  }

  render() {
    var {title,text} = this.state.item
    return (
      <form className="editor" onSubmit={this.handleSave}>
        <input type="text" value={title} onChange={event => this.itemChange({title: event.target.value})} />
        <textarea value={text} onChange={event => this.itemChange({text: event.target.value})} />
        <input type="file" multiple onChange={this.fileChange} />
        <input type="submit" value="保存" />
      </form>
    )
  }
}

export default Editor
