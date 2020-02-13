import React, { useState, useEffect, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import marked from 'marked'
import { convertLatex } from './utils/katex'
import { fetchText } from './utils/fetch'

function Paper() {
  const navigate = useNavigate()
  const params = useParams()
  const pathname = params['*'] || 'index'

  const [text, setText] = useState('')
  const [textNode, setTextNode] = useState({})

  useEffect(() => {
    async function fetchData(key) {
      const text = await fetchText(key)
      setText(text)
    }
    fetchData(pathname)
  }, [pathname])

  useEffect(() => {
    if (textNode.innerHTML) {
      document.querySelectorAll('a').forEach(a => {
        a.addEventListener('click', (e) => {
          e.preventDefault()
          const { pathname } = new URL(a.href)
          navigate(pathname)
        })
      })

      document.title = document.querySelector('h1')?.innerText
    }
  })

  const rawMarkup = useMemo(() => {
    return marked(convertLatex(text), { breaks: true })
  }, [text])

  return <div ref={setTextNode} dangerouslySetInnerHTML={{ __html: rawMarkup }}></div>
}

export default Paper
