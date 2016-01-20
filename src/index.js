import React from 'react'
import { render } from 'react-dom'
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import thunk from 'redux-thunk'
import app from './reducers'

import Root from './page/Root.js'

// create a store that has redux-thunk middleware enabled
const createStoreWithMiddleware = applyMiddleware(
  thunk
)(createStore)
export let store = createStoreWithMiddleware(app)

store.subscribe(() =>
  console.log(store.getState())
)

render(
  <Provider store={store}>
    <Root />
  </Provider>,
  document.getElementById('wrapper')
)
