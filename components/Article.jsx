import React from 'react'
import HyperText from './HyperText.jsx'
import marked from 'marked'

export default (props) => {
  var {id, title, text, lastChange} = props.item

  var parts = text.split(/(!\[.*?,.*?,.*?,.*?\])/)
  var out = []
  parts.forEach((x, i) => {
    if (i % 2 === 0) {
      if (x !== '\n') {
        let rawMarkup = marked(x, {breaks: true, sanitize: true})
        out.push(<div key={i} dangerouslySetInnerHTML={{__html: rawMarkup}}></div>)
      }
    } else {
      let m = x.match(/!\[(.*?),(.*?),(.*?),(.*?)\]/)
      let data = {
        name: m[1],
        size: m[2],
        type: m[3],
        id: m[4],
      }
      out.push(<HyperText key={i} data={data} />)
    }
  })

  var edit = []
  if (props.auth) edit = <a href={`#/e/${id}`}> 编辑</a>

  return <article className="post">
    <header className="post-header">
      <h1 className="post-title">{title}</h1>
      <p className="post-meta">
        {new Date(lastChange).toDateString()}
        {edit}
      </p>
    </header>
    {out}
  </article>
}
