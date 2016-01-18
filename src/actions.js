export const INIT_FRAGMENT = 'INIT_FRAGMENT'

export const UPDATE_ITEM = 'UPDATE_ITEM'
export const NEW_ITEM = 'NEW_ITEM'

// const UPLOAD_FILE = 'UPLOAD_FILE'
// const ERASE_FILE = 'ERASE_FILE'

export function add(item, none) {
  // sync(item)
  if (none) {
    return {
      type: NEW_ITEM,
      item
    }
  } else {
    return {
      type: UPDATE_ITEM,
      item
    }
  }
}

export function show(id) {
  // get(id)
  // let item = {id}

  return {
    type: UPDATE_ITEM,
    item
  }
}

export function init() {
  // getContents()
  // let fragment = {}

  return {
    type: INIT_FRAGMENT,
    fragment
  }
}
