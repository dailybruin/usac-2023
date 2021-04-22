import React from "react";
import ResultsEntry from "./ResultsEntry";
import { Accordion, AccordionItem } from "react-sanfona";
class ResultsTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    let candidateData = this.props.candidateData;
    //Now we want to sort the candidate data array
    candidateData.sort((a, b) => {
      if (a.percentage < b.percentage) {
        return 1;
      }
      if (a.percentage > b.percentage) {
        return -1;
      }
      return 0;
    });


    let tableSections = candidateData.map(c => (
      <ResultsEntry
        key={c.name}
        name={c.name}
        slate={c.slate}
        image={c.image}
        count={c.percentage}
      />
    ));
    return (
      // TODO: Map each candidate within the position + their sanctions
      <div className={this.props.genRep ? "gen-rep" : "not-gen-rep"}>
        <h2>{this.props.positionData.position.toUpperCase()}</h2>
        {tableSections}
      </div>
    );
  }
}

export default ResultsTable;