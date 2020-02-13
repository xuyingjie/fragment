import React from 'react'
import {
  BrowserRouter as Router,
  Routes,
  Route
} from 'react-router-dom'

import Paper from './Paper'

function App() {
  return (
    <Router>
      <section className="main-content">
        <Routes>
          <Route path="*" element={<Paper />} />
        </Routes>
      </section>
    </Router>
  )
}

export default App
