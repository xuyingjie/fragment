import { getFile, uploadFile } from '../utils/cos'

export const INIT_LIST = Symbol()

export const initList = () => async (dispatch) => {
  const list = await getFile({ filepath: 'list' })
  dispatch({
    type: INIT_LIST,
    list
  })
  return 1
}

export const addPaper = (paper, isNew) => async (dispatch, getState) => {
  await uploadFile({
    filepath: `paper/${paper.id}`,
    data: paper
  })

  let { list } = getState()
  const { id, title, last } = paper

  if (isNew) {
    list = [{ id, title, last }, ...list]
  } else {
    list = list.map(item => {
      if (item.id === id) {
        return { id, title, last }
      } else {
        return item
      }
    })
  }
  await uploadFile({
    filepath: 'list',
    data: list
  })

  dispatch({
    type: INIT_LIST,
    list
  })
  return 1
}
