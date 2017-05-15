import React from 'react'
import signOut from '../assets/sign-out.svg'
import signIn from '../assets/sign-in.svg'

const Header = ({ auth, logout }) => (
  <header>
    <div className="wrap">
      <a className="site-title" href="#/">CODE</a>
      {
        auth ?
          <span onClick={logout}><img className="sign-icon" alt="注销" src={signOut} /></span>
          :
          <a href="#/login"><img className="sign-icon" alt="登录" src={signIn} /></a>
      }
    </div>
  </header>
)

export default Header