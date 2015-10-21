class Attachment extends React.Component {

  constructor(props) {
    super(props);
    this.state = {url: [], wait: false};
  }

  componentDidMount() {
    this.loadIMG();
    // console.log('componentDidMount');
  }

  componentWillReceiveProps() {
    this.loadIMG();
    // console.log('componentWillReceiveProps');
  }

  loadIMG() {
    var x = this.props.data;
    if (x.type === 'image/png' || x.type === 'image/jpeg' || x.type === 'image/vnd.microsoft.icon'){
      if (!this.state.url[x.key] && !this.state.wait) {
        this.setState({wait: true});
        get({
          key: x.key,
          arrayBuffer: true,
          success: function(data) {
            var blob = new Blob([data], {'type': x.type});
            var objecturl = URL.createObjectURL(blob);

            var url = this.state.url;
            url[x.key] = objecturl;
            this.setState({url: url});
            this.setState({wait: false});

            // console.log('uuuu');
          }.bind(this)
        });
      }
    }
  }

  download(file, e) {
    e.preventDefault();

    var progress = false;
    if (document.getElementById(file.key)) {
      progress = document.getElementById(file.key);
    }

    get({
      key: file.key,
      arrayBuffer: true,
      progress,
      success: function(data) {
        var blob = new Blob([data], {
          'type': file.type
        });
        var objecturl = URL.createObjectURL(blob);

        // 生成下载
        var anchor = document.createElement('a');
        anchor.href = objecturl;

        // 新标签页打开
        // anchor.target = '_blank';

        // 直接下载
        anchor.download = file.name;

        document.body.appendChild(anchor);
        var evt = document.createEvent('MouseEvents');
        evt.initEvent('click', true, true);
        anchor.dispatchEvent(evt);
        document.body.removeChild(anchor);

        if (progress) {
          progress.value = 0;
        }
      }
    });
  }

  render() {
    var x = this.props.data;
    var c;
    var inline = {
      'display': 'inline-block'
    };
    var downloadIcon = {
      'display': 'block',
      'marginTop': '-17px',
      'marginRight': '1px',
      'cursor': 'pointer'
    };

    if (x.type === 'image/png' || x.type === 'image/jpeg' || x.type === 'image/vnd.microsoft.icon'){
      c = (
        <div>
          <img src={this.state.url[x.key]} data-key={x.key} onDragStart={this.props.dragStart} />
          <div className="fa fa-external-link right" style={downloadIcon} onClick={this.download.bind(this, x)}></div>
        </div>
      );
    } else {
      c = (
        <div className="attachment">
          <File key={x.key} data={x} dragStart={this.props.dragStart} download={this.download} />
        </div>
      );
    }

    return <div style={inline}>{c}</div>;
  }
}

class File extends React.Component {

  render() {
    var x = this.props.data;

    return (
      <div>
        <a className="item" title={x.name} data-key={x.key} draggable='true' onDragStart={this.props.dragStart} onClick={this.props.download.bind(this, x)}>
          <i className={fileTypeIcons(x.type) + " fa-fw fa-lg"}></i>&nbsp;
          {x.name}
          <span className="right">{x.size}</span>
        </a>
        <div id={x.key} className="item progress-bar"></div>
      </div>
    );
  }
}
