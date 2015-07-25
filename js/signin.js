class SignIn extends React.Component {

  handleSubmit(e) {
    e.preventDefault();

    var name = this.refs.name.getDOMNode().value;
    var passwd = this.refs.passwd.getDOMNode().value;

    get({
      key: name,
      token: passwd,
      success: function(data){

        localStorage.token = data.user.token;
        localStorage.user = JSON.stringify(data.user);

        this.props.login();
        this.refs.name.getDOMNode().value = '';
        this.refs.passwd.getDOMNode().value = '';
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
          <input type="password" className="form-control" id="inputPassword3" ref="passwd"/>
        </div>
        <button type="submit" className="btn">Sign in</button>
      </form>
    );
  }
}
