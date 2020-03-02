import React, { useState } from 'react'
import { Routes, Route } from 'react-router-dom'

import Header from './components/Header'
import Log from './components/Log/Log'
import Login from './components/Login'
import Join from './components/Join'

function App() {
  const [auth, setAuth] = useState(Boolean(localStorage.a))
  const [refresh, setFefresh] = useState(Symbol())
  const [preview, setPreview] = useState(false)

  return (
    <>
      <Header auth={auth} setAuth={setAuth} setFefresh={setFefresh} preview={preview} setPreview={setPreview} />
      <main>
        <div className="wrapper">
          <Routes>
            {auth &&
              <Route path="/*" element={<Log refresh={refresh} preview={preview} />} />
            }
            <Route path="/login" element={<Login setAuth={setAuth} />} />
            <Route path="/join" element={<Join />} />
          </Routes>
        </div>
      </main>
    </>
  )
}

export default App
