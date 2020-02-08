/**
 * hook 用于解决函数组件里的 状态 和 生命周期
 */
import { useState, useEffect } from 'react'
import { readAsJson } from './utils'

export const initialState = {
  auth: Boolean(localStorage.user),
  list: []
}

export function reducer(state, action) {
  switch (action.type) {
    case 'SIGN_IN':
      return { ...state, auth: true }
    case 'SIGN_OUT':
      return { ...state, auth: false }
    case 'INIT_LIST':
      return { ...state, list: action.list }
    default:
      throw new Error()
  }
}

// 自定义 hooks
export function usePaper(id) {
  const [paper, setPaper] = useState({})

  useEffect(() => {
    async function fetchData(id) {
      const paper = await readAsJson({ key: `paper/${id}` })
      setPaper(paper)
    }
    id && fetchData(id)
  }, [id])

  return paper
}
