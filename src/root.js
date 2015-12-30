import React from 'react';
import ReactDOM from 'react-dom';

import Section from './page/Section';
import Editor from './page/Editor';
import SignIn from './page/SignIn';
import SignUp from './page/SignUp';
import Contents from './page/Contents';
import Navbar from './components/Navbar';

import { get, upload } from './utils/http';
import * as crypto from './utils/crypto';

class Root extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      contents: [],
      auth: false,
      url: location.hash,
      erase: false,
    };
  }

  componentDidMount() {
    this.auth();
    window.onhashchange = () => this.setState({ url: location.hash });
  }

  cache() {
    get({
      key: 'contents',
      success: data => {
        this.setState({ contents: data.contents });
      },
    });
  }

  // post to database server
  handleUploadSetToServer(data) {
    if (data.title !== '') {
      const contents = this.state.contents;
      let uploadContents = true;

      data.timestamp = Date.now();

      const t = {
        id: data.id,
        title: data.title,
      // timestamp: data.timestamp,
      };

      if (t.id === '') {
        t.id = crypto.timeDiff();
        data.id = t.id;
        contents.push(t);
      } else {
        for (const i in contents) {
          if (t.id === contents[i].id) {
            if (t.title !== contents[i].title) {
              contents[i] = t;
            } else {
              uploadContents = false;
            }
          }
        }
      }

      this.setState({ contents });

      upload({
        key: 'set/' + t.id,
        data: JSON.stringify({ section: data }),
        success: () => {
          if (uploadContents) {
            upload({
              key: 'contents',
              data: JSON.stringify({ contents }),
              success: () => {
                location.href = '#/t/' + t.id;
              },
            });
          } else {
            location.href = '#/t/' + t.id;
          }
        },
      });
    }
  }

  handleErase(key) {
    upload({
      key,
      data: 'x',
      success: () => {
        this.setState({ erase: true });
      },
    });
  }

  handleEraseEnd() {
    this.setState({ erase: false });
  }

  handleLogin() {
    this.setState({ auth: true });
    this.cache();
    location.href = '#/';
  }

  handleLogout() {
    localStorage.removeItem('user');
    this.setState({ auth: false });
    this.setState({ contents: [] });
    location.replace('#/login');
  }

  auth() {
    if (localStorage.user) {
      this.setState({ auth: true });
      this.cache();
    } else {
      location.href = '#/login';
    }
  }

  render() {
    let page;
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
      default:
        page = <Contents {...this.state} />;
        break;
    }

    return (
      <div>
        <Navbar auth={this.state.auth} logout={this.handleLogout.bind(this)} erase={this.handleErase.bind(this)} />
        <div className="row">
          <div className="large-12 columns">
            {page}
          </div>
        </div>
      </div>
      );
  }
}

ReactDOM.render(<Root />, document.getElementById('wrapper'));
