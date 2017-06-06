import React from 'react'
import {
  HashRouter as Router,
  Route
} from 'react-router-dom'
import { connect } from 'react-redux'
import { SIGN_IN } from '../actions/sign'

import HeaderWrapper from './HeaderWrapper'
import ListWrapper from './ListWrapper'
import Edit from './Edit'
import Login from './Login'
import Join from './Join'
import FilterPaper from './FilterPaper'

let Root = ({ dispatch }) => {
  if (localStorage.user) {
    dispatch({ type: SIGN_IN })
  }

  // https://reacttraining.com/react-router/web/api/HashRouter
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
