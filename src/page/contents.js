export class Contents extends React.Component {

  render() {
    let contents = this.props.contents.slice(0).reverse();
    return (
      <div className="x-contents">
        <a className="label" href="#/tasks">任务</a>
        {contents.map(x => {
          return <a className="secondary label" key={x.id} href={"#/t/" + x.id}>{x.title}</a>;
        })}
      </div>
    );
  }
}
