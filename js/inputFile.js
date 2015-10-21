class InputFile extends React.Component {

  constructor(props) {
    super(props);
    this.state = {i: 0};
  }

  handleClick(e) {
    e.preventDefault();

    var file = document.getElementById('file');
    var evt = document.createEvent('MouseEvents');
    evt.initEvent('click', true, true);
    file.dispatchEvent(evt);
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
    reader.onload = function(e) {

      var key = 'u/' + timeDiff();

      upload({
        key,
        data: reader.result,
        arrayBuffer: true,
        progress: document.getElementById('upload-progress'),
        success: function() {
          this.props.uploadFileSuccess(key, file);

          // 递归上传
          this.handleChange();
        }.bind(this)
      });

    }.bind(this);
    reader.readAsArrayBuffer(file);
  }

  render() {
    return (
      <div className="attachment">
        <input id="file" style={{display: 'none'}} type="file" multiple onChange={this.handleChange.bind(this)} />
        <a id="file-info" className="item" onClick={this.handleClick}>
          选择文件上传
        </a>
        <div id="upload-progress" className="item progress-bar"></div>
      </div>
    );
  }
}
