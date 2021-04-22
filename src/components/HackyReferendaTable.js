import React from "react";
import { Accordion, AccordionItem } from "react-sanfona";
import { SlideDown } from "react-slidedown";
import "react-slidedown/lib/slidedown.css";

class HackyReferendaResultsEntry extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="sanctions-entry results">
        <div className="entry-header">
          <div className="photo" />
          <div className="info">
            <div className="name">{this.props.name}</div>
          </div>
          <div className="score">{this.props.count}</div>
        </div>
      </div>
    );
  }
}

class HackyReferendaTable extends React.Component {
  render() {
    let refData = [
      {
        title: "Yes",
        votes: "5131"
      },
      {
        title: "No",
        votes: "1218"
      }
    ];

    let tableSections = refData.map(c => (
      <HackyReferendaResultsEntry
        key={c.title}
        name={c.title}
        count={c.votes}
      />
    ));

    return (
      <div className="not-gen-rep">
        <h2>INTERNATIONAL STUDENT REPRESENTATIVE CONSTITUTIONAL AMENDMENT</h2>
        {tableSections}
      </div>
    );
  }
}

export default HackyReferendaTable;