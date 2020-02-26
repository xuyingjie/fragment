import React from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { del, postsDir } from '../utils'

function Header({ state, dispatch }) {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const isEdit = pathname.match('/edit/')

  async function delCurrentPost() {
    const id = pathname.split('/').pop()
    const status = await del(`${postsDir}/${id}`)
    if (status) {
      navigate('/')
    }
  }

  function logout() {
    localStorage.clear()
    dispatch({ type: 'SIGN_OUT' })
    navigate('/login')
  }

  return (
    <header className="site-header">
      <div className="wrapper">
        <Link className="site-title" to="/">Cache</Link>

        <nav className="site-nav">
          {isEdit && <button className="page-link" onClick={delCurrentPost}>删除</button>}
          {
            state.auth ?
              <>
                <Link className="page-link" to="/add">新建</Link>
                <button className="page-link" onClick={logout}>注销</button>
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
