import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

import { getList, parseId } from '../utils/index'
import { formatTime } from '../utils/date'

function Home() {
  const [posts, setPosts] = useState([])

  useEffect(() => {
    async function fetchData() {
      const data = await getList()
      const list = []
      for (let i = 0; i < data.length; i++) {
        const id = data[i]['Key'].split('/').pop()
        list.push({
          id,
          title: (await parseId(id)).slice(13),
          last: data[i]['LastModified']
        })
      }
      list.sort((a, b) => new Date(b.last) - new Date(a.last))
      setPosts(list)
    }
    fetchData()
  }, [])

  return (
    <ul className="post-list">
      {posts.map(item => (
        <li key={item.id}>
          <span className="post-meta">{formatTime(item.last)}</span>
          <h3>
            <Link className="post-link" to={`/${item.id}`}>{item.title}</Link>
          </h3>
        </li>
      ))}
    </ul>
  )
}

export default Home
