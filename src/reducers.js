import { combineReducers } from 'redux'
import { INIT_FRAGMENT, UPDATE_ITEM, NEW_ITEM } from './actions'

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
    default:
      return state
  }
}

const app = combineReducers({
  fragment
})

export default app
