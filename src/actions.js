import { get, upload } from './utils/http'

export const INIT_FRAGMENT = 'INIT_FRAGMENT'

export const UPDATE_ITEM = 'UPDATE_ITEM'
export const NEW_ITEM = 'NEW_ITEM'

// const UPLOAD_FILE = 'UPLOAD_FILE'
// const ERASE_FILE = 'ERASE_FILE'

export const SIGN_IN = 'SIGN_IN'
export const SIGN_OUT = 'SIGN_OUT'
export const CLEAN = 'CLEAN'
export const CHANGE_URL = 'CHANGE_URL'

export function add(item, newItem) {
  return (dispatch) => {
    let key = `set/${item.id}`
    return upload({ key, data: JSON.stringify(item) })
      .then(() => {
        location.href = '#/t/' + item.id
        if (newItem) {
          return dispatch({
            type: NEW_ITEM,
            item
          })
        } else {
          return dispatch({
            type: UPDATE_ITEM,
            item
          })
        }
      })
  }
}

export function show(id) {
  return (dispatch) => {
    let key = `set/${id}`
    return get({ key })
      .then(out => dispatch({
        type: UPDATE_ITEM,
        item: JSON.parse(out)
      }))
  }
}

export function init() {
  return (dispatch) => {
    return get({ key: 'contents' })
      .then(out => dispatch({
        type: INIT_FRAGMENT,
        fragment: JSON.parse(out)
      }))
  }
}


export function setAuth() {
  return {
    type: SIGN_IN
  }
}

export function login(key, passwd, iv) {
  return (dispatch) => {
    return get({ key, passwd, iv })
      .then(user => {
        localStorage.user = user
        location.href = '#/'
        dispatch(init())
        return dispatch(setAuth())
      })
  }
}

export function logout() {
  return (dispatch) => {
    localStorage.removeItem('user')
    location.replace('#/login')
    dispatch({
      type: CLEAN
    })
    return dispatch({
      type: SIGN_OUT
    })
  }
}

export function changeURL(url) {
  return {
    type: CHANGE_URL,
    url
  }
}
