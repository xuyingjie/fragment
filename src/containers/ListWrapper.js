import React from 'react'
import { connect } from 'react-redux'
import { initList } from '../actions'

import List from '../components/List'

let ListWrapper = ({ dispatch, list, auth }) => {
  dispatch(initList())

  return <List list={list} auth={auth} />
}

ListWrapper = connect(
  (state) => ({
    auth: state.auth,
    list: state.list,
  })
)(ListWrapper)

export default ListWrapper