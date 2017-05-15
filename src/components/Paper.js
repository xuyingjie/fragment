import React from 'react'
import HyperText from './HyperText'
import marked from 'marked'

const Paper = ({ paper, auth }) => {
  let { id, title, text, last } = paper

  let parts = text.split(/(!\[.*?,.*?,.*?,.*?\])/)
  let out = []
  parts.forEach((part, i) => {
    if (i % 2 === 0) {
      if (part !== '\n') {
        let rawMarkup = marked(part, { breaks: true, sanitize: true })
        out.push(<div key={i} dangerouslySetInnerHTML={{ __html: rawMarkup }}></div>)
      }
    } else {
      let m = part.match(/!\[(.*?),(.*?),(.*?),(.*?)\]/)
      let file = {
        name: m[1],
        size: m[2],
        type: m[3],
        id: m[4],
      }
      out.push(<HyperText key={i} file={file} />)
    }
  })

  return (
    <div>
      <article>
        <h1>{title}</h1>
        {out}
      </article>
      <footer>
        <p className="subheader">
          {new Date(last).toDateString().replace(/(.{4})(.{6})(.{5})/, '$2,$3 ')}
          {
            auth ?
              <a href={`#/edit/${id}`}>编辑</a>
              : ''
          }
        </p>
      </footer>
    </div>
  )
}

export default Paper