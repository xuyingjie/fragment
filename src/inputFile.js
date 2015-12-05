import {upload} from './tools/tool';
import * as crypto from './tools/crypto';

export class InputFile extends React.Component {

  constructor(props) {
    super(props);
    this.state = {i: 0};
  }

  handleChange() {

    var files = document.getElementById('file').files;
    var i = this.state.i;

    if (i < files.length) {

      var j = i + 1;
      this.setState({i: j});

      document.getElementById('file-info').innerHTML = files[i].name;
      this.readAndUpload(files[i]);

    } else {

      document.getElementById('file').value = '';
      document.getElementById('file-info').innerHTML = '选择文件上传';
      this.setState({i: 0});
    }
  }

  readAndUpload(file) {
    var reader = new FileReader();
    reader.onload = e => {

      var key = 'u/' + crypto.timeDiff();

      upload({
        key,
        data: reader.result,
        arrayBuffer: true,
        progress: document.getElementById('upload-progress'),
        success: () => {
          this.props.uploadFileSuccess(key, file);

          // 递归上传
          this.handleChange();
        }
      });

    };
    reader.readAsArrayBuffer(file);
  }

  render() {
    return (
      <button type="button" className="small button x-upload">
        <span id="file-info">
          选择文件上传
        </span>
        <input id="file" type="file" multiple onChange={this.handleChange.bind(this)} />
        <i id="upload-progress"></i>
      </button>
    );
  }
}
