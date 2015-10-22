import {InputFile} from './inputFile';
import {get, insertText} from './tool';

export class Editor extends React.Component {

  constructor(props) {
    super(props);
    this.state = {section: {id: '', title: '', content: ''}};
  }

  componentDidMount() {
    var id = location.hash.slice(4);

    if (id) {
      get({
        key: 'set/' + id,
        success: function(data){
          this.setState({section: data.section});
        }.bind(this)
      });
    }
  }

  handleTitleChange(event) {
    var x = this.state.section;
    x.title = event.target.value;
    this.setState({section: x});
  }
  handleContentChange(event) {
    var x = this.state.section;
    x.content = event.target.value;
    this.setState({section: x});
  }

  uploadSetToServer(e) {
    e.preventDefault();
    this.props.uploadSetToServer(this.state.section);
  }

  uploadFileSuccess(key, file) {
    var c = `\n![${file.name},${(file.size/1024).toFixed(2)}KB,${file.type},${key}]`;

    var textarea = document.getElementById('content');
    insertText(textarea, c);

    var section = this.state.section;
    section.content = textarea.value;
    this.setState({section: section});
  }

  render() {
    var x = this.state.section;
    return (
      <div>
        <form onSubmit={this.uploadSetToServer.bind(this)}>
          <div className="form-group">
            <input type="text" className="form-control" placeholder="key" onChange={this.handleTitleChange.bind(this)} value={x.title} />
          </div>
          <div className="form-group">
            <textarea id="content" className="form-control" rows="17" placeholder="value" onChange={this.handleContentChange.bind(this)} value={x.content} />
          </div>
          <button type="submit" className="btn right">Save</button>
        </form>

        <InputFile uploadFileSuccess={this.uploadFileSuccess.bind(this)} />
      </div>
    );
  }
}
