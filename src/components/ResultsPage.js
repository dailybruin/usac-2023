import React from "react";
import ResultsTable from "./ResultsTable";
import HackyReferendaTable from "./HackyReferendaTable";
import "../sass/sanctions.scss";

class ResultsPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sanctionData: 1,
      candidates: null,
    };
  }

  getInfo() {
    fetch(
      "https://kerckhoff.dailybruin.com/api/packages/flatpages/flatpage.2022.usac-elections/"
    )
      .then((res) => res.json())
      .then((data) => {
        const sanctions = data.data["data.aml"].sanctions;
        const candidateData = data.data["data.aml"].profiles;
        const refData = data.data["data.aml"].referenda;
        const images = data.images.s3;
        candidateData.map((candidate) => {
          candidate.candidates.map((indv) => {
            if (indv.image) {
              const img = images[indv.image];
              if (img) {
                indv.image = img.url;
              }
            }
          });
        });
        //Get images from Kerckhoff
        this.setState({ sanctionData: sanctions, candidates: candidateData, ref: refData });
      });
  }

  componentDidMount() {
    this.getInfo();
  }

  render() {
    // We want to separate sanctions (if one has multiple recipients create a sanction for each one)
    // Then we want to group the sanctions by candidate
    let table;
    if (!this.state.candidates) {
      return (
        <div>
          <h2>Loading...</h2>
        </div>
      );
    }
    let unreleased = true;
    table = this.state.candidates.map((position) => {
      console.log(position.results);
      
      if (position.results != "n") {
        return (
          <>
          <ResultsTable
            key={position.position}
            positionData={position}
            sanctions={this.state.sanctionData}
            candidateData={position.candidates}
            genRep={
              position.position == "General Representative" ? true : false
            }
          />
          
           
          </>
        );
      } else if(unreleased) {
        unreleased = false;
        return (
          <h2>Election results will be announced on May 6 at 8 pm. Please check back later.</h2>
        );
        
      }
    });
    // Group candidates by position
    return <div>{table} <br></br> <br></br>
    </div>;
  }
}

export default ResultsPage;

/*
<h2 className="referendum-title-endorsed">
            Passed 82.47% - Constitutional Amendment 1
          </h2>
          <br></br>
          <h2 className="referendum-title-endorsed">
            Passed 80.96% - Constitutional Amendment 2
          </h2>
          <br></br>
          <h2 className="referendum-title-endorsed">
            Passed 80.83% - Constitutional Amendment 3
          </h2>
          <br></br>
          <h2 className="referendum-title-not-endorsed">
            Not Passed - Bruin Emergency Relief Fund Referendum
          </h2>
          <div className="candidateOverlayPlatform">
          <p>Only 19.82% of undergraduate students voted in the 2021 Undergraduate Students Association Election, down from 30.06% in last year’s election.</p>
          <p>A minimum of 20% of undergraduate students must participate in voting for a referendum to pass.</p>
          </div></div>;*/

