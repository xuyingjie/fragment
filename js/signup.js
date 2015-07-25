class SignUp extends React.Component {

  successInfo(info) {
    var div = document.createElement('div');
    div.innerHTML = `<div id="success-info">${info}</div>`;
    document.body.appendChild(div);

    var tick = setTimeout(function() {
      document.body.removeChild(div);
      clearTimeout(tick);
    }, 700);
  }

  handleSubmit(e) {
    e.preventDefault();

    var name = this.refs.name.getDOMNode().value;
    var passwd = this.refs.passwd.getDOMNode().value;
    var token = this.refs.token.getDOMNode().value;
    var AK = this.refs.AK.getDOMNode().value;
    var SK = this.refs.SK.getDOMNode().value;

    var user = { AK, SK, token };

    localStorage.token = token;
    localStorage.user = JSON.stringify(user);

    upload({
      key: name,
      data: JSON.stringify({user: user}),
      token: passwd,
      success: function() {
        // console.log('Success!!!');
        this.successInfo('Success!!!');
      }.bind(this)
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
          <label htmlFor="inputPassword3">Password</label>
          <input type="text" className="form-control" id="inputPassword3" ref="passwd"/>
        </div>
        <div className="form-group">
          <label htmlFor="token">Token</label>
          <input type="text" className="form-control" id="token" ref="token"/>
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
