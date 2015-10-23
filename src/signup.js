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
        <div className="form-group">
          <label htmlFor="inputName3">Name</label>
          <input type="text" className="form-control" id="inputName3" ref="name"/>
        </div>
        <div className="form-group">
          <label htmlFor="secret">Password</label>
          <input type="text" className="form-control" id="secret" ref="secret"/>
        </div>
        <div className="form-group">
          <label htmlFor="passwd">Random Password</label>
          <input type="text" className="form-control" id="passwd" ref="passwd"/>
        </div>
        <div className="form-group">
          <label htmlFor="iv">iv</label>
          <input type="text" className="form-control" id="iv" ref="iv"/>
        </div>
        <div className="form-group">
          <label htmlFor="AK">AK</label>
          <input type="text" className="form-control" id="AK" ref="AK"/>
        </div>
        <div className="form-group">
          <label htmlFor="SK">SK</label>
          <input type="text" className="form-control" id="SK" ref="SK"/>
        </div>
        <button type="submit" className="btn">Sign up</button>
      </form>
    );
  }
}
