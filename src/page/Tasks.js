import React from 'react';
import {get, upload} from '../utils/http';
import * as crypto from '../utils/crypto';

export default class Tasks extends React.Component {

  constructor(props) {
    super(props);
    this.state = {tasks: [], query: [], editID: ''};
  }

  componentDidMount() {
    get({
      key: 'tasks',
      success: data => {
        this.setState({tasks: data.tasks});
        this.setState({query: data.tasks});
      },
    });
  }

  handleChange(e) {
    let keyword = e.target.value;
    let query = [];
    let s = new RegExp(keyword, 'i');
    for (let x of this.state.tasks) {
      if (x.content.match(s) !== null) {
        query.push(x);
      }
    }
    this.setState({query: query});
  }

  handleEdit(t) {
    this.setState({editID: t.id});
    this.refs.content.value = t.content;
  }

  save(e) {
    e.preventDefault();

    if (this.refs.content.value !== ''){

      let tasks = this.state.tasks;

      if (this.state.editID !== ''){
        for (let i in tasks) {
          if (this.state.editID === tasks[i].id) {
            tasks.splice(i,1);
            this.setState({editID: ''});
          }
          // console.log('editID: '+this.state.editID);
        }
      }

      let t = {
        id: crypto.timeDiff(),
        content: this.refs.content.value,
      };
      tasks.push(t);
      // console.log(this.state.tasks);
      // this.setState({tasks: tasks});

      upload({
        key: 'tasks',
        data: JSON.stringify({tasks: tasks}),
        success: () => {

          this.setState({query: tasks});
          this.refs.content.value = '';
        },
      });

    }
  }

  render() {
    let tasks = this.state.query.slice(0).reverse();

    return (
      <div>
        <form onSubmit={this.save.bind(this)}>
          <input type="text" placeholder="tasks" onChange={this.handleChange.bind(this)} ref="content" />
        </form>

        {tasks.map(x => {
          return (
            <p key={x.id}>
              {`${x.content} `}
              <a className="octicon octicon-pencil" onClick={this.handleEdit.bind(this, x)}></a>
            </p>
          );
        })}
      </div>
    );
  }
}
