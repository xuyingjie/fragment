import React from 'react';
import {upload} from '../utils/http';

export default class SignUp extends React.Component {

  handleSubmit(e) {
    e.preventDefault();

    let name = this.refs.name.value;
    let secret = this.refs.secret.value;
    let passwd = this.refs.passwd.value;
    let iv = this.refs.iv.value;
    let AK = this.refs.AK.value;
    let SK = this.refs.SK.value;

    let user = {
      AK, SK, passwd, iv,
    };

    localStorage.user = JSON.stringify(user);

    upload({
      key: name,
      data: JSON.stringify({
        user: user,
      }),
      passwd: secret,
      success: () => {
        console.log('Success!!!');
      },
    });
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit.bind(this)}>
        <label>
          Name
          <input type="text" ref="name"/>
        </label>
        <label>
          Password
          <input type="text" ref="secret"/>
        </label>
        <label>
          Random Password
          <input type="text" ref="passwd"/>
        </label>
        <label>
          iv
          <input type="text" ref="iv"/>
        </label>
        <label>
          AK
          <input type="text" ref="AK"/>
        </label>
        <label>
          SK
          <input type="text" ref="SK"/>
        </label>
        <button type="submit" className="button">Sign up</button>
      </form>
    );
  }
}
