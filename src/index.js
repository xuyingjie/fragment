import { createStore } from 'redux'
import app from './reducers'

import { show, add } from './actions'

let store = createStore(app)


// Test
store.subscribe(() =>
  console.log(store.getState())
)

store.dispatch(add({
  id: Date.now(),
  text: 'hello world'
}, true))
