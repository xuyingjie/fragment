import React from 'react'
import { Link } from '@reach/router'

function Header({ state, dispatch }) {

  function logout() {
    localStorage.clear()
    dispatch({ type: 'SIGN_OUT' })
  }

  return (
    <header className="site-header">
      <div className="wrapper">
        <Link className="site-title" to="/">Code</Link>

        <nav className="site-nav">
          {
            state.auth ?
              <>
                <Link className="page-link" to="/add">新建</Link>
                <Link className="page-link" to="#" onClick={logout}>注销</Link>
              </>
              :
              <Link className="page-link" to="/login">登录</Link>
          }
        </nav>
      </div>
    </header>
  )
}

export default Header
