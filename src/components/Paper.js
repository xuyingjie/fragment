import React, { useMemo } from 'react'
import { usePaper } from '../reducer'

import { Link } from '@reach/router'
import HyperText from './HyperText'

import marked from 'marked'
import { formatTime } from '../utils/date'
import { convertLatex } from '../utils/katex'

function Paper({ state, id }) {
  const { title = '', text = '', last = 0 } = usePaper(id)

  const content = useMemo(() => {
    function convertText(text) {
      text = convertLatex(text)
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
    return convertText(text)
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
