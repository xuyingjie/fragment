import { INIT_LIST } from '../actions'

const list = (state = [], action) => {
  switch (action.type) {
    case INIT_LIST:
      return action.list
    default:
      return state
  }
}

export default list