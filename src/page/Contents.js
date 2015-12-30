import React from 'react';

export default class Contents extends React.Component {

  render() {
    let contents = this.props.contents.slice(0).reverse();
    return (
      <div className="x-contents">
        {contents.map(x => {
          return <a className="secondary label" key={x.id} href={'#/t/' + x.id}>{x.title}</a>;
        })}
      </div>
    );
  }
}
