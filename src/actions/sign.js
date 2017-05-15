import { getFile } from '../utils/cos'

export const SIGN_IN = Symbol()
export const SIGN_OUT = Symbol()

export const logout = () => (dispatch) => {
  localStorage.clear()
  dispatch({ type: SIGN_OUT })
  return 1
}

export const login = (name, passwd) => async (dispatch) => {
  const user = await getFile({
    filepath: name,
    passwd
  })
  localStorage.user = JSON.stringify(user)
  dispatch({ type: SIGN_IN })
  return 1
}
