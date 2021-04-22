import React from "react";

class SanctionsRecent extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let firstThree = this.props.sanctions.reverse().slice(0, 3);
    let count = 0;
    const recents = firstThree.map(sanction => {
      return (
        <div className="sanction-list-entry">
          <a href={sanction.link} target="_blank">
            <div className="entry-title">{sanction.recipients} | {sanction.title}</div>
            <div className="entry-time">{sanction.time}</div>
          </a>
          <hr />
        </div>
      );
    });

    return <div>{recents}</div>;
  }
}

export default SanctionsRecent;