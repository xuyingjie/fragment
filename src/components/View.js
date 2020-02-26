import React, { useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import { usePost } from '../reducer'
import HyperText from './HyperText'

import marked from 'marked'
import { formatTime } from '../utils/date'
// import { convertLatex } from '../utils/katex'

function View() {
  const { id } = useParams()
  const { title = '', text = '', last = 0 } = usePost(id)

  const content = useMemo(() => {
    function convertText(text) {
      // text = convertLatex(text)
      const arr = []
      const parts = text.split(/(!\[.*?,.*?,.*?\])/)
      parts.forEach((part, i) => {
        if (i % 2 === 0) {
          if (part !== '\n') {
            const rawMarkup = marked(part, { breaks: true })
            arr.push(<div key={i} dangerouslySetInnerHTML={{ __html: rawMarkup }}></div>)
          }
        } else {
          const m = part.match(/!\[(.*?,.*?,.*?)\]/)
          arr.push(<HyperText key={i} info={m[1]} />)
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
          <Link to={`/edit/${id}`}>编辑</Link>
        </p>
      </header>

      <div className="post-content">
        {content}
      </div>
    </article>
  )
}

export default View
