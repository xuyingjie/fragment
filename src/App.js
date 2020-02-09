import React, { useReducer, useEffect } from 'react'
import { Router } from '@reach/router'

import { reducer, initialState } from './reducer'
import { readAsJson } from './utils'

import Header from './components/Header'
import Home from './components/Home'
import Edit from './components/Edit'
import Paper from './components/Paper'
import Login from './components/Login'
import Join from './components/Join'

function App() {
  const [state, dispatch] = useReducer(reducer, initialState)

  useEffect(() => {
    async function fetchData() {
      const list = await readAsJson({ key: 'list' }) || []
      dispatch({ type: 'INIT_LIST', list })
    }
    fetchData()
  }, [dispatch])

  return (
    // 或者使用Context传递数据
    // <Context.Provider value={{ state, dispatch }}>
    <React.Fragment>
      <Header state={state} dispatch={dispatch} />
      <main className="page-content">
        <div className="wrapper">
          <Router>
            <Home default path="/" state={state} />
            <Edit path="/add" state={state} dispatch={dispatch} />
            <Edit path="/edit/:id" state={state} dispatch={dispatch} />
            <Paper path="/article/:id" state={state} />
            <Login path="/login" dispatch={dispatch} />
            <Join path="/join" />
          </Router>
        </div>
      </main>
    </React.Fragment>
  )
}

export default App
