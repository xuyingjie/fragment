import { connect } from 'react-redux'
import { logout } from '../actions/sign'

import Header from '../components/Header'


const HeaderWrapper = connect(
  (state) => ({
    auth: state.auth
  }),
  (dispatch) => ({
    logout: () => {
      dispatch(logout())
    }
  })
)(Header)

export default HeaderWrapper