import {siteTitle} from './tools/tool';

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
    let key = e.dataTransfer.getData('key');
    if (key !== ''){
      this.props.erase(key);
    }
  }

  render() {
    let title = siteTitle;
    let ctrl = '';

    if(this.props.auth){
      title = <a href="#/">{siteTitle}</a>;
      ctrl = (
        <div>
          <a className="octicon octicon-plus" href="#/a"></a>
          <a className="octicon octicon-trashcan" onDragOver={this.preventDefault} onDrop={this.drop.bind(this)}></a>
          <a className="octicon octicon-sign-out" onClick={this.handleLogoutClick.bind(this)}></a>
        </div>
      );
    }

    return (
      <nav className="row x-bar">
        <div className="large-12 columns">
          <h1>{title}</h1>
          {ctrl}
        </div>
      </nav>
    );
  }
}
