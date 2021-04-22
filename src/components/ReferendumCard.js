import React from "react";
import "../sass/referenda.scss";

class ReferendumCard extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="referendum-card">
        <h2 className="referendum-title">{this.props.referendumData.title}</h2>
        <p className="referendum-desc">{this.props.referendumData.desc}</p>
      </div>
    );
  }
}

export default ReferendumCard;