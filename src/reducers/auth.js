import { SIGN_IN, SIGN_OUT } from '../actions/sign'

const auth = (state = false, action) => {
  switch (action.type) {
    case SIGN_IN:
      return true
    case SIGN_OUT:
      return false
    default:
      return state
  }
}

export default auth
