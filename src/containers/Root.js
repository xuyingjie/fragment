import React from 'react'
import {
  HashRouter as Router,
  Route
} from 'react-router-dom'
import { connect } from 'react-redux'
import { initList } from '../actions'
import { SIGN_IN, logout } from '../actions/sign'

import Header from '../components/Header'
import List from '../components/List'
import Edit from './Edit'
import Login from './Login'
import Join from './Join'
import FilterPaper from './FilterPaper'

const HeaderWrapper = connect(
  (state) => ({
    auth: state.auth
  }),
  (dispatch) => ({
    logout: () => {
      dispatch(logout())
    }
  })
)(Header)

const ListWrapper = connect(
  (state) => ({
    auth: state.auth,
    list: state.list,
  })
)(List)

let Root = ({ dispatch }) => {
  dispatch(initList())
  if (localStorage.user) {
    dispatch({ type: SIGN_IN })
  }

  return (
    <Router>
      <div>
        <HeaderWrapper />
        <main>
          <div className="wrap">
            <Route exact path="/" component={ListWrapper} />
            <Route path="/login" component={Login} />
            <Route path="/join" component={Join} />
            <Route path="/new" component={Edit} />
            <Route path="/paper/:id" component={FilterPaper} />
            <Route path="/edit/:id" component={FilterPaper} />
          </div>
        </main>
      </div>
    </Router>
  )
}

Root = connect()(Root)

export default Root
