import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { upload } from '../utils/file'

function Header({ auth, setAuth, setFefresh, preview, setPreview }) {
  const navigate = useNavigate()
  const [progressNode, setProgressNode] = useState(null)

  async function handleFileChange(e) {
    const files = e.target.files
    await upload({
      files,
      onprogress: (e) => {
        if (e.lengthComputable) progressNode.style.width = (e.loaded === e.total) ? 0 : e.loaded / e.total * 100 + '%'
      }
    })
    setFefresh(Symbol())
  }

  function logout() {
    localStorage.clear()
    setAuth(false)
    navigate('/login')
  }

  return (
    <header className="site-header">
      <div className="wrapper">
        <Link className="site-title" to="/">Log</Link>

        <nav className="site-nav">
          {
            auth ?
              <>
                <label className="page-link">上传文件
                  <input type="file" multiple onChange={handleFileChange} />
                  <i className="progress" ref={setProgressNode}></i>
                </label>
                <button className="page-link" onClick={() => setPreview(!preview)}>预览</button>
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
