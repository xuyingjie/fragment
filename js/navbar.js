import {siteTitle} from './tool';

export class Navbar extends React.Component {

  handleLogoutClick(e) {
    e.preventDefault();
    this.props.logout();
  }

  preventDefault(e) {
    e.preventDefault();
  }

  drop(e) {
    e.preventDefault();
    var key = e.dataTransfer.getData('key');
    if (key !== ''){
      this.props.erase(key);
    }
  }

  render() {
    var button;
    if(this.props.auth){
      button = (
        <div>
          <a className="nav-site nav-title" href="#/">{siteTitle}</a>
          <div className="right nav-right">
            <a className="nav-site" title="添加" href="#/a">
              <span className="fa fa-plus" aria-hidden="true"></span>
            </a>
            <div className="nav-site" onDragOver={this.preventDefault} onDrop={this.drop.bind(this)}>
              <span className="fa fa-trash-o" aria-hidden="true"></span>
            </div>
            <span className="nav-site"></span>
            <a className="nav-site" onClick={this.handleLogoutClick.bind(this)}>
              <span className="fa fa-sign-out" aria-hidden="true"></span>
            </a>
          </div>
        </div>
      );
    } else {
      button = <span className="nav-site nav-title">{siteTitle}</span>;
    }

    return (
      <nav className="nav-main">
        <div className="wrap">
          {button}
        </div>
      </nav>
    );
  }
}
