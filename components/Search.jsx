import React from 'react'
import Article from './Article.jsx'

class Search extends React.Component {

  constructor(props) {
    super(props)
    this.state = { set: [] }
    this.filter = this.filter.bind(this)
  }

  filter(e) {
    var re = new RegExp(e.target.value, 'i')
    var set = this.props.set.filter(item => item.title.match(re) || item.text.match(re))
    this.setState({set})
  }

  componentDidMount() {
    this.props.loadSet()
    this.setState({set: this.props.set})
  }

  componentWillReceiveProps(nextProps) {
    this.props.loadSet()
    this.setState({set: nextProps.set})
  }

  render() {
    return <div className="search">
      <input type="text" onChange={this.filter} />
      {this.state.set.map(item => <Article key={item.id} item={item} auth={this.props.auth} />)}
    </div>
  }
}

export default Search
