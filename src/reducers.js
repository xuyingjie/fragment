import { combineReducers } from 'redux'
import { INIT_FRAGMENT, UPDATE_ITEM, NEW_ITEM, SIGN_IN, SIGN_OUT, CLEAN, CHANGE_URL } from './actions'

function fragment(state=[], action) {
  switch (action.type) {
    case INIT_FRAGMENT:
      return action.fragment
    case UPDATE_ITEM:
      return state.map(el => {
        if (el.id === action.item.id) {
          return action.item
        } else {
          return el
        }
      })
    case NEW_ITEM:
      return [...state, action.item]
    case CLEAN:
      return []
    default:
      return state
  }
}

function auth(state=false, action) {
  switch (action.type) {
    case SIGN_IN:
      return true
    case SIGN_OUT:
      return false
    default:
      return state
  }
}

function url(state='', action) {
  switch (action.type) {
    case CHANGE_URL:
      return action.url
    default:
      return state
  }
}

const app = combineReducers({
  fragment, auth, url
})

export default app
