import {Section} from './section';
import {Editor} from './editor';
import {SignIn} from './signin';
import {SignUp} from './signup';
import {Tasks} from './tasks';
import {Contents} from './contents';
import {Navbar} from './navbar';

import {get, upload} from './tool';
import * as crypto from './lib/crypto';

class Root extends React.Component {

  constructor(props) {
    super(props);
    this.state = {contents: [], auth: false, url: location.hash, erase: false};
  }

  cache(){
    get({
      key: 'contents',
      success: function(data){
        this.setState({contents: data.contents});
      }.bind(this)
    });
  }

  // post to database server
  handleUploadSetToServer(data){
    if (data.title !== '') {

      var contents = this.state.contents;
      var uploadContents = true;

      data.timestamp = Date.now();

      var t = {
        id: data.id,
        title: data.title
        // timestamp: data.timestamp
      };

      if (t.id === '') {
        t.id = crypto.timeDiff();
        data.id = t.id;
        contents.push(t);
      } else {
        for (let i in contents) {
          if (t.id === contents[i].id) {
            if (t.title !== contents[i].title) {
              contents[i] = t;
            } else {
              uploadContents = false;
            }
          }
        }
      }

      this.setState({contents: contents});

      upload({
        key: 'set/' + t.id,
        data: JSON.stringify({section: data}),
        success: function() {

          if (uploadContents) {
            upload({
              key: 'contents',
              data: JSON.stringify({contents: contents}),
              success: function() {
                location.href='#/t/'+ t.id;
              }
            });
          } else {
            location.href='#/t/'+ t.id;
          }
        }
      });

    }
  }

  handleErase(key) {
    upload({
      key,
      data: 'x',
      success: function() {
        this.setState({erase: true});
      }.bind(this)
    });
  }

  handleEraseEnd() {
    this.setState({erase: false});
  }

  handleLogin() {
    this.setState({auth: true});
    this.cache();
    location.href='#/';
  }

  handleLogout() {
    localStorage.removeItem('user');
    this.setState({auth: false});
    this.setState({contents: []});
    location.replace('#/login');
  }

  auth() {
    if (localStorage.user) {
      this.setState({auth: true});
      this.cache();
    } else {
      location.href='#/login';
    }
  }

  componentDidMount() {
    this.auth();
    window.onhashchange = () => this.setState({ url : location.hash });
  }

  render(){
    var page;
    switch (this.state.url.split('/')[1]) {
      case 't':
        page = <Section {...this.state} eraseEnd={this.handleEraseEnd.bind(this)} uploadSetToServer={this.handleUploadSetToServer.bind(this)} />;
        break;
      case 'a':
      case 'e':
        page = <Editor {...this.state} uploadSetToServer={this.handleUploadSetToServer.bind(this)} />;
        break;
      case 'login':
        page = <SignIn {...this.state} login={this.handleLogin.bind(this)} />;
        break;
      case 'join':
        page = <SignUp {...this.state} />;
        break;
      case 'tasks':
        page = <Tasks {...this.state} />;
        break;
      default:
        page = <Contents {...this.state} />;
        break;
    }

    return (
      <div>
        <Navbar auth={this.state.auth} logout={this.handleLogout.bind(this)} erase={this.handleErase.bind(this)} />
        <div className="wrap">{page}</div>
      </div>
      );
  }
}

ReactDOM.render(<Root />, document.getElementById('wrapper'));
