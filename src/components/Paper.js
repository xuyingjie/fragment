import React, { useState, useEffect } from 'react'
import { Link } from '@reach/router'
import marked from 'marked'
import { usePaper } from '../reducer'
import HyperText from './HyperText'
import { formatTime } from '../utils/date'

function Paper({ state, id }) {
  const { title, text, last = 0 } = usePaper(id)
  const [content, setContent] = useState([])

  useEffect(() => {
    function convertText(text) {
      const arr = []
      const parts = text.split(/(!\[.*?,.*?,.*?,.*?\])/)
      parts.forEach((part, i) => {
        if (i % 2 === 0) {
          if (part !== '\n') {
            const rawMarkup = marked(part, { breaks: true })
            arr.push(<div key={i} dangerouslySetInnerHTML={{ __html: rawMarkup }}></div>)
          }
        } else {
          const m = part.match(/!\[(.*?),(.*?),(.*?),(.*?)\]/)
          const file = {
            name: m[1],
            size: m[2],
            type: m[3],
            id: m[4],
          }
          arr.push(<HyperText key={i} file={file} />)
        }
      })
      return arr
    }
    text && setContent(convertText(text))
  }, [text])

  return (
    <article>
      <header className="post-header">
        <h1 className="post-title">{title}&nbsp;</h1>
        <p className="post-meta">
          <time>{formatTime(last)}</time>
          {state.auth && <Link to={`/edit/${id}`}>编辑</Link>}
        </p>
      </header>

      <div className="post-content">
        {content}
      </div>
    </article>
  )
}

export default Paper
