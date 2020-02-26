import React, { useReducer } from 'react'
import {
  // BrowserRouter as Router,
  HashRouter as Router,
  Routes,
  Route
} from 'react-router-dom'

import { reducer, initialState } from './reducer'

import Header from './components/Header'
import Home from './components/Home'
import Edit from './components/Edit'
import View from './components/View'
import Login from './components/Login'
import Join from './components/Join'

function App() {
  const [state, dispatch] = useReducer(reducer, initialState)

  return (
    // 或者使用Context传递数据
    // <Context.Provider value={{ state, dispatch }}>
    <Router>
      <Header state={state} dispatch={dispatch} />
      <main className="page-content">
        <div className="wrapper">
          <Routes>
            {state.auth &&
              <>
                <Route path="/" element={<Home />} />
                <Route path="/add" element={<Edit />} />
                <Route path="/edit/:id" element={<Edit />} />
                <Route path="/:id" element={<View />} />
              </>
            }
            <Route path="/login" element={<Login dispatch={dispatch} />} />
            <Route path="/join" element={<Join />} />
          </Routes>
        </div>
      </main>
    </Router>
  )
}

export default App
