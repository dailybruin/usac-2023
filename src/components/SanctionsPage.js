import React from "react";
import SanctionsTable from "./SanctionsTable";
import SanctionsRecent from "./SanctionsRecent";
import "../sass/sanctions.scss";
class SanctionsPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sanctionData: 1,
      candidates: null,
      loaded: false,
    };
  }

  getInfo() {
    fetch(
      "https://kerckhoff.dailybruin.com/api/packages/flatpages/usac-2023/"
    )
      .then((res) => res.json())
      .then((data) => {
        // const sanctions = data.data["data.aml"].sanctions;
        const candidateData = data.data["data.aml"].profiles;
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
        fetch(
          "https://kerckhoff.dailybruin.com/api/packages/flatpages/usac-2023/"
        )
          .then((res) => res.json())
          .then((data) => {
            this.setState({
              sanctionData: data.data["sanctions.aml"].sanctions,
              disclaimer: data.data["sanctions.aml"].disclaimer,
              loaded: true,
              candidates: candidateData,
            });
          });
      });
  }

  componentDidMount() {
    this.getInfo();
  }

  render() {
    // We want to separate sanctions (if one has multiple recipients create a sanction for each one)
    // Then we want to group the sanctions by candidate
    let table;
    if (!this.state.loaded) {
      return (
        <div>
          <h2>Loading...</h2>
        </div>
      );
    }
    table = this.state.candidates.map((position) => {
      return (
        <SanctionsTable
          key={position.position}
          positionData={position}
          sanctions={this.state.sanctionData}
          candidateData={position.candidates}
        />
      );
    });
    console.log(this.state.disclaimer[0].text);
    // Group candidates by position
    return (
      <>
      <p>{this.state.disclaimer[0].text}</p>
      <div>
        <h2>RECENT SANCTIONS</h2>
        <SanctionsRecent sanctions={this.state.sanctionData} />
        {table}
      </div> </>
    );
  }
}

export default SanctionsPage;