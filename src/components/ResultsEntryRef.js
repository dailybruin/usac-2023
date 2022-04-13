import React from "react";
import { SlideDown } from "react-slidedown";
import "react-slidedown/lib/slidedown.css";
/*
key={c.name}
name={c.name}
slate={c.slate}
image={c.image}
count={c.sanctionCount}
list={c.sanctionList} */
class ResultsEntryRef extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="sanctions-entry results">
        <div className="entry-header">
          <div className="info">
            <div className="name">{this.props.title}</div>
          </div>
          <div className="score">{this.props.count}</div>
        </div>
      </div>
    );
  }
}

export default ResultsEntryRef;