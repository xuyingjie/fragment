import {get} from './tools/tool';

export class SignIn extends React.Component {

  handleSubmit(e) {
    e.preventDefault();

    var name = this.refs.name.value;
    var passwd = this.refs.passwd.value;
    var iv = this.refs.iv.value;

    get({
      key: name,
      passwd,
      iv,
      success: data => {

        localStorage.user = JSON.stringify(data.user);

        this.props.login();
        this.refs.name.value = '';
        this.refs.passwd.value = '';
        this.refs.iv.value = '';
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
          <label htmlFor="inputPassword3">Password</label>
          <input type="text" className="form-control" id="inputPassword3" ref="passwd"/>
        </div>
        <div className="form-group">
          <label htmlFor="iv">iv</label>
          <input type="text" className="form-control" id="iv" ref="iv"/>
        </div>
        <button type="submit" className="btn">Sign in</button>
      </form>
    );
  }
}
