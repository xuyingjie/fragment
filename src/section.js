import {Attachment} from './attachment';
import {get} from './tools/tool';

export class Section extends React.Component {

  constructor(props) {
    super(props);
    this.state = {section: {id: '', title: '', content: ''}, eraseKey: ''};
  }

  componentDidMount() {
    let id = location.hash.slice(4);

    get({
      key: 'set/' + id,
      success: data => {
        this.setState({section: data.section});
      }
    });
  }

  dragStart(e) {
    let key = e.target.dataset.key;
    e.dataTransfer.setData('key', key);

    this.setState({eraseKey: key});
  }

  // 在组件接收到新的 props 的时候调用。在初始化渲染的时候，该方法不会调用。
  componentWillReceiveProps(nextProps) {
    if (nextProps.erase && this.state.eraseKey !== '') {

      let c = this.state.section;
      let reg = new RegExp('!\\[.*?,.*?,.*?,' + this.state.eraseKey + ']');
      c.content = c.content.replace(reg, '');

      this.props.uploadSetToServer(c);
      this.setState({section: c});
      this.setState({eraseKey: ''});
      this.props.eraseEnd();
      // console.log('AAAAAAAA');
    }
  }

  render() {
    let x = this.state.section;

    let parts = x.content.split(/(!\[.*?,.*?,.*?,.*?\])/);
    for (let i in parts) {
      if (i % 2 === 0) {
        if (parts[i] !== '') {
          let rawMarkup = marked(parts[i], {
            breaks: true,
            sanitize: true
          });
          parts[i] = <section key={i} dangerouslySetInnerHTML={{__html: rawMarkup}}></section>;
        }
      } else {
        let m = parts[i].match(/!\[(.*?),(.*?),(.*?),(.*?)\]/);

        let data = {
          name: m[1],
          size: m[2],
          type: m[3],
          key: m[4]
        };
        parts[i] =  <Attachment key={i} data={data} dragStart={this.dragStart.bind(this)} />;
      }
    }

    return (
      <article>
        <h2><a href={"#/e/" + x.id} title="编辑">{x.title}</a></h2>
        {parts}
      </article>
    );
  }
}
