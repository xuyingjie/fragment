import React from 'react'
import {get, getSrc} from '../tools'

class HyperText extends React.Component {

  constructor(props) {
    super(props)
    this.state = { url: '' }
    this.download = this.download.bind(this)
  }

  download() {
    var {name, type, id} = this.props.data

    get(`file/${id}`, {file:true}).then(data => {
      var blob = new Blob([data], {type})

      var anchor = document.createElement('a')
      anchor.href = URL.createObjectURL(blob)
      // anchor.target = '_blank'
      anchor.download = name

      document.body.appendChild(anchor)
      var evt = document.createEvent('MouseEvents')
      evt.initEvent('click', true, true)
      anchor.dispatchEvent(evt)
      document.body.removeChild(anchor)
    })
  }

  componentDidMount() {
    var {type, id} = this.props.data
    if (type.match(/jpeg|icon|png|gif|svg/)){
      getSrc(type,id).then(url => this.setState({url}))
    }
  }

  render() {
    var {name, size, type} = this.props.data
    var out = (
      <p>
        <strong>{`${name} ${size} `}</strong>
        <a href="javascript:;" onClick={this.download}>下载</a>
      </p>
    )
    if (type.match(/jpeg|icon|png|gif|svg/)) {
      out = <img src={this.state.url} />
    }

    return out
  }
}

export default HyperText
