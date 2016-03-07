import React from 'react'

export default (props) => {
  var Li = (props) => <li>
    <span className="post-meta">{new Date(props.id).toDateString().replace(/(.{4})(.{6})(.{5})/,'$2,$3')}</span>
    <h2><a className="post-link" href={`#/u/${props.id}`}>{props.title}</a></h2>
  </li>

  return (
    <ul className="post-list">
      {props.list.map(item => <Li key={item.id} {...item} />)}
    </ul>
  )
}
