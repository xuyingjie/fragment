import React from 'react';
import {upload} from '../utils/http';
import * as crypto from '../utils/crypto';

export default class InputFile extends React.Component {

  constructor(props) {
    super(props);
    this.state = {i: 0};
  }

  handleChange() {

    let files = this.refs.select.files;
    let i = this.state.i;

    if (i < files.length) {

      let j = i + 1;
      this.setState({i: j});

      this.refs.info.innerHTML = files[i].name;
      this.readAndUpload(files[i]);

    } else {

      this.refs.select.value = '';
      this.refs.info.innerHTML = '选择文件上传';
      this.setState({i: 0});
    }
  }

  readAndUpload(file) {
    let reader = new FileReader();
    reader.onload = () => {

      let key = 'u/' + crypto.timeDiff();

      upload({
        key,
        data: reader.result,
        arrayBuffer: true,
        progress: this.refs.progress,
        success: () => {
          this.props.uploadFileSuccess(key, file);

          // 递归上传
          this.handleChange();
        },
      });

    };
    reader.readAsArrayBuffer(file);
  }

  render() {
    return (
      <button type="button" className="small button x-upload">
        <span ref="info">
          选择文件上传
        </span>
        <input type="file" multiple onChange={this.handleChange.bind(this)} ref="select" />
        <i ref="progress"></i>
      </button>
    );
  }
}
