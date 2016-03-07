import React from 'react'
import Article from './Article.jsx'

export default React.createClass({
  getInitialState() {
    return {
      set: []
    }
  },

  filter(e) {
    var re = new RegExp(e.target.value, 'i')
    var set = this.props.set.filter(item => item.title.match(re) || item.text.match(re))
    this.setState({set})
  },

  componentDidMount() {
    this.props.loadSet()
    this.setState({set: this.props.set})
  },

  componentWillReceiveProps(nextProps) {
    this.props.loadSet()
    this.setState({set: nextProps.set})
  },

  render() {
    return <div className="search">
      <input type="text" onChange={this.filter} />
      {this.state.set.map(item => <Article key={item.id} item={item} />)}
    </div>
  }
})
