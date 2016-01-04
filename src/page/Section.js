import React from 'react'
import marked from 'marked'
import Attachment from '../components/Attachment'
import {get, upload} from '../utils/http'

export default class Section extends React.Component {

  constructor(props) {
    super(props)
    this.state = {section: {id: '', title: '', content: ''}}
  }

  componentDidMount() {
    let id = location.hash.slice(4)

    get({
      key: 'set/' + id,
      success: data => {
        this.setState({section: data.section})
      },
    })
  }

  handleErase(key) {
    upload({
      key,
      data: 'x',
      success: () => {
        let c = this.state.section
        let reg = new RegExp('!\\[.*?,.*?,.*?,' + key + ']')
        c.content = c.content.replace(reg, '')

        this.props.uploadSetToServer(c)
        this.setState({section: c})
      },
    })
  }

  render() {
    let x = this.state.section

    let parts = x.content.split(/(!\[.*?,.*?,.*?,.*?\])/)
    for (let i in parts) {
      if (i % 2 === 0) {
        if (parts[i] !== '') {
          let rawMarkup = marked(parts[i], {
            breaks: true,
            sanitize: true,
          })
          parts[i] = <section key={i} dangerouslySetInnerHTML={{__html: rawMarkup}}></section>
        }
      } else {
        let m = parts[i].match(/!\[(.*?),(.*?),(.*?),(.*?)\]/)

        let data = {
          name: m[1],
          size: m[2],
          type: m[3],
          key: m[4],
        }
        parts[i] =  <Attachment key={i} data={data} erase={this.handleErase.bind(this)} />
      }
    }

    return (
      <article>
        <h3><a href={'#/e/' + x.id} title="编辑">{x.title}</a></h3>
        {parts}
      </article>
    )
  }
}
