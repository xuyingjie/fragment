import React from 'react'
import { connect } from 'react-redux'
import { init, show, add, setAuth, login, logout, changeURL } from '../actions'

import Section from './Section'
import Editor from './Editor'
import SignIn from './SignIn'
import SignUp from './SignUp'
import Contents from './Contents'
import Navbar from '../components/Navbar'

import { upload } from '../utils/http'
import * as crypto from '../utils/crypto'

class Root extends React.Component {

  componentDidMount() {
    if (localStorage.user) {
      this.props.dispatch(setAuth())
      this.props.dispatch(init())
    } else {
      location.href = '#/login'
    }
    this.props.dispatch(changeURL(location.hash))
    window.onhashchange = () => this.props.dispatch(changeURL(location.hash))
  }

  handleUploadSetToServer(item) {
    let contents = this.props.contents
    let uploadContents = true
    let newItem = false

    item.timestamp = Date.now()

    const t = {
      id: item.id,
      title: item.title,
    }

    if (t.id === '') {
      t.id = crypto.timeDiff()
      contents.push(t)

      newItem = true
      item.id = t.id
    } else {
      for (let i in contents) {
        if (t.id === contents[i].id) {
          if (t.title !== contents[i].title) {
            contents[i] = t
          } else {
            uploadContents = false
          }
        }
      }
    }

    if (uploadContents) upload({ key: 'contents', data: JSON.stringify(contents) })
    this.props.dispatch(add(item, newItem))
  }

  render() {
    let { dispatch, fragment, auth, url } = this.props
    let page
    switch (url.split('/')[1]) {
      case 't':
        page = <Section fragment={fragment} getItem={id => dispatch(show(id))} uploadSetToServer={item => dispatch(add(item))} />
        break
      case 'a':
      case 'e':
        page = <Editor fragment={fragment} uploadSetToServer={this.handleUploadSetToServer.bind(this)} />
        break
      case 'login':
        page = <SignIn login={(key,passwd,iv)=>dispatch(login(key,passwd,iv))} />
        break
      case 'join':
        page = <SignUp />
        break
      default:
        page = <Contents fragment={fragment} />
        break
    }

    return (
      <div>
        <Navbar auth={auth} logout={() => dispatch(logout())} />
        <div className="row">
          <div className="large-12 columns">
            {page}
          </div>
        </div>
      </div>
      )
  }
}

function select(state) {
  return {
    fragment: state.fragment,
    contents: state.fragment.map(el => {
      return {
        id: el.id,
        title: el.title
      }
    }),
    auth: state.auth,
    url: state.url,
  }
}

export default connect(select)(Root)
