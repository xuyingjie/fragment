import React from 'react'
import ReactDOM from 'react-dom'
import { HashRouter as Router } from 'react-router-dom'   // BrowserRouter as Router

import 'normalize.css'
import './assets/main.css'

import App from './App'

ReactDOM.render(<Router><App /></Router>, document.getElementById('root'))
