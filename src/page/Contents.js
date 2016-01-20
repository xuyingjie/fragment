import React from 'react'

export default class Contents extends React.Component {

  render() {
    let out = this.props.fragment.slice(0).reverse()
    return (
      <div className="x-contents">
        {out.map(x => {
          return <a className="secondary label" key={x.id} href={'#/t/' + x.id}>{x.title}</a>
        })}
      </div>
    )
  }
}
