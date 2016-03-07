import React from 'react'
import ReactDOM from 'react-dom'
import Navbar from './Navbar.jsx'
import Contents from './Contents.jsx'
import Article from './Article.jsx'
import Editor from './Editor.jsx'
import Search from './Search.jsx'
import Login from './Login.jsx'
import Join from './Join.jsx'
import {privacy, get, upload} from '../tools'

var Root = React.createClass({
  getInitialState() {
    return {
      list: [],
      set: [],
      auth: false,
      url: '',
      item: {id: 0, title: '', text: '', lastChange: 0},
      loadAll: false,
    }
  },

  loadList() {
    get('list').then(out => {
      this.setState({list: out.list})
    })
  },

  loadItem(id) {
    let out = this.state.set.filter(item => item.id === id)
    if (out.length === 0) {
      get(`set/${id}`).then(item => {
        this.setState({item})
        this.setState({set: [...this.state.set, item]})
      })
    } else {
      this.setState({item: out[0]})
    }
  },

  loadSet() {
    if (this.state.list.length > 0 && !this.state.loadAll) {
      this.state.list.forEach(item => {
        this.loadItem(item.id)
      })
      this.setState({loadAll: true})
    }
  },

  login(name, passwd) {
    get(name, {passwd}).then(data => {
      localStorage.user = JSON.stringify(data)
      this.setState({auth:true})
      if (privacy) this.loadList()
      location.replace('#/')
    })
  },

  save(item) {
    var l = [...this.state.list]
    var s = [...this.state.set]

    var sub = {id: item.id, title: item.title}

    var newList = false
    if (item.id === 0) {
      item.id = Date.now()
      sub.id = item.id
      l = [sub, ...l]
      s = [item, ...s]
      newList = true
    } else {
      l.forEach((el, i) => {
        if (el.id === item.id && el.title !== item.title) {
          l[i] = sub
          newList = true
        }
      })
      s = s.map(el => el.id === item.id ? item : el)
    }
    upload(`set/${item.id}`, item).then(() => {
      if (newList) {
        upload(`list`, { list: l }).then(() => {
          this.setState({list:l})
          this.setState({set:s})
          location.replace(`#/u/${item.id}`)
        })
      } else {
        this.setState({set:s})
        location.replace(`#/u/${item.id}`)
      }
    })
  },

  hashChange() {
    var hash = location.hash.split('/')
    this.setState({item: {id: 0, title: '', text: '', lastChange: 0}})
    this.setState({url: hash[1]})
    switch (hash[1]) {
      case 'e':
      case 'u':
        this.loadItem(Number(hash[2]))
        break
      case 'o':
        localStorage.removeItem('user')
        this.setState({list:[]})
        this.setState({set:[]})
        this.setState({auth:false})
        location.assign('#/i')
        break
      default:
        break
    }
  },

  componentDidMount() {
    this.hashChange()
    window.onhashchange = this.hashChange

    if (localStorage.user) this.setState({auth:true})

    if (localStorage.user || !privacy) {
      this.loadList()
    } else {
      location.assign('#/i')
    }
  },

  render() {
    var {url, list, set, item, auth} = this.state

    var page = []
    switch (url) {
      case 'i':
        page = <Login login={this.login} />
        break
      case 'a':
      case 'e':
        page = <Editor item={item} save={this.save} />
        break
      case 'u':
        page = <Article item={item} />
        break
      case 's':
        page = <Search set={set} loadSet={this.loadSet} />
        break
      case 'join':
        page = <Join />
        break
      default:
        page = <Contents list={list} />
    }

    return <div>
      <Navbar auth={auth} />
      <div className="page-content">
        <div className="wrapper">
          {page}
        </div>
      </div>
    </div>
  }
})

ReactDOM.render(<Root />, document.getElementById('root'))
