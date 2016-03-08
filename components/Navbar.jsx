import React from 'react'

export default ({auth}) => (
  <header className="site-header">
    <div className="wrapper">
      <a className="site-title" href="#/">TITLE</a>
      <nav className="site-nav">
        <a className="page-link" href="#/s">搜索</a>
        {
          auth ?
            <span>
              <a className="page-link" href="#/a">新建</a>
              <a className="page-link" href="#/o">注销</a>
            </span>
            :
            <a className="page-link" href="#/i">登录</a>
        }
      </nav>
    </div>
  </header>
)
