import { connect } from 'react-redux'
import { initList } from '../actions'

import List from '../components/List'

const ListWrapper = connect(
  (state) => ({
    auth: state.auth,
    list: state.list,
  }),
  (dispatch) => ({
    initList: () => {
      dispatch(initList())
    }
  })
)(List)

export default ListWrapper