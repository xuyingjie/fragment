import React from 'react'
import pencil from '../assets/pencil.svg'

class List extends React.Component {

  componentDidMount() {
    this.props.initList()
  }

  render() {
    const { auth, list } = this.props

    return (
      <div>
        {
          auth ?
            (<div className="ctrl">
              <a href="#/new"><img src={pencil} alt="新建" /></a>
            </div>)
            : ''
        }
        <ul className="post-list">
          {list.map(item => (
            <li key={item.id}>
              <a href={`#/paper/${item.id}`}>{item.title}</a>
            </li>
          ))}
        </ul>
      </div>
    )
  }
}

export default List