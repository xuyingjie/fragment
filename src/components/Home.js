import React from 'react'
import { Link } from '@reach/router'

import { formatTime } from '../utils/date'

function Home({ state }) {
  return (
    <ul className="post-list">
      {state.list.map(item => (
        <li key={item.id}>
          <span className="post-meta">{formatTime(item.last)}</span>
          <h3>
            <Link className="post-link" to={`/article/${item.id}`}>{item.title}</Link>
          </h3>
        </li>
      ))}
    </ul>
  )
}

export default Home
