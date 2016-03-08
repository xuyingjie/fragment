import React from 'react'

export default ({list}) => {

  var Li = ({id, title}) => (
    <li>
      <span className="post-meta">{new Date(id).toDateString().replace(/(.{4})(.{6})(.{5})/,'$2,$3')}</span>
      <h2><a className="post-link" href={`#/u/${id}`}>{title}</a></h2>
    </li>
  )

  return (
    <ul className="post-list">
      {list.map(item => <Li key={item.id} {...item} />)}
    </ul>
  )
}
