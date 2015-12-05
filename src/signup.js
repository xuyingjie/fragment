import {upload} from './tools/tool';

export class SignUp extends React.Component {

  successInfo(info) {
    var div = document.createElement('div');
    div.innerHTML = `<div id="success-info">${info}</div>`;
    document.body.appendChild(div);

    var tick = setTimeout(() => {
      document.body.removeChild(div);
      clearTimeout(tick);
    }, 700);
  }

  handleSubmit(e) {
    e.preventDefault();

    var name = this.refs.name.value;
    var secret = this.refs.secret.value;
    var passwd = this.refs.passwd.value;
    var iv = this.refs.iv.value;
    var AK = this.refs.AK.value;
    var SK = this.refs.SK.value;

    var user = { AK, SK, passwd, iv };

    localStorage.user = JSON.stringify(user);

    upload({
      key: name,
      data: JSON.stringify({user: user}),
      passwd: secret,
      success: () => {
        // console.log('Success!!!');
        this.successInfo('Success!!!');
      }
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
