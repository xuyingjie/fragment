/**
 * hook 用于解决函数组件里的 状态 和 生命周期
 */
import { useState, useEffect } from 'react'
import { get, postsDir, parseId } from './utils'

export const initialState = {
  auth: Boolean(localStorage.user),
}

export function reducer(state, action) {
  switch (action.type) {
    case 'SIGN_IN':
      return { ...state, auth: true }
    case 'SIGN_OUT':
      return { ...state, auth: false }
    default:
      throw new Error()
  }
}

// 自定义 hooks
export function usePost(id) {
  const [post, setPost] = useState({})

  useEffect(() => {
    async function fetchData(id) {
      const post = await get({ key: `${postsDir}/${id}` })
      if (post) {
        post.title = (await parseId(id)).slice(13)
        setPost(post)
      }
    }
    id && fetchData(id)
  }, [id])

  return post
}
