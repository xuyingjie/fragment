class Contents extends React.Component {

  render() {
    var contents = this.props.contents.slice(0).reverse();
    return (
      <div className="contents">
        <a className="btn index" href="#/tasks" role="button">任务</a>
        {contents.map(function(x){
          return <a className="btn index" key={x.id} href={"#/t/" + x.id} role="button">{x.title}</a>;
        })}
      </div>
    );
  }
}
