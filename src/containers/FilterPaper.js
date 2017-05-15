import React from 'react'
import { connect } from 'react-redux'
import { getFile } from '../utils/cos'

import Paper from '../components/Paper'
import Edit from './Edit'

class FilterPaper extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      paper: {}
    }
  }

  async componentDidMount() {
    const id = this.props.match.params.id
    const paper = await getFile({ filepath: `paper/${id}` })
    this.setState({ paper })
  }

  render() {
    const { paper } = this.state
    const { auth, match } = this.props
    const isEdit = match.path.match('edit')
    return paper.id ?
      isEdit ?
        <Edit paper={paper} />
        :
        <Paper paper={paper} auth={auth} />
      : <div></div>
  }
}

// mapStateToProps
// mapDispatchToProps
const mapStateToProps = (state) => ({
  auth: state.auth
})

const FilterPaperContainer = connect(mapStateToProps)(FilterPaper)

export default FilterPaperContainer