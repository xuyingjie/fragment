import {icons, get} from './tools/tool';

export class Attachment extends React.Component {

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
          success: data => {
            var blob = new Blob([data], {'type': x.type});
            var objecturl = URL.createObjectURL(blob);

            var url = this.state.url;
            url[x.key] = objecturl;
            this.setState({url: url});
            this.setState({wait: false});

            // console.log('uuuu');
          }
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
    let x = this.props.data;
    let c = '';

    if (x.type === 'image/png' || x.type === 'image/jpeg' || x.type === 'image/vnd.microsoft.icon'){
      c = <img className="thumbnail" title="下载" src={this.state.url[x.key]} data-key={x.key} onDragStart={this.props.dragStart} onClick={this.download.bind(this, x)} />;
    } else {
      c = (
        <a className="label" title={x.name} data-key={x.key} draggable='true' onDragStart={this.props.dragStart} onClick={this.download.bind(this, x)}>
          <i className={icons(x.type)}></i>
          {` ${x.name} ${x.size}`}
          <i id={x.key}></i>
        </a>
      );
    }
    return <p className="x-attachment">{c}</p>;
  }
}
