import React from "react";
import ReferendumCard from "./ReferendumCard";
import "../sass/referenda.scss";

class ReferendaPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      referenda: null
    };
    this.getInfo();
  }

  getInfo() {
    fetch(
      "https://kerckhoff.dailybruin.com/api/packages/flatpages/usac.elections2018/"
    )
      .then(res => res.json())
      .then(data => {
        const referendaData = data.data["data.aml"].referenda;
        this.setState({
          referenda: referendaData
        });
      });
  }

  render() {
    if (!this.state.referenda) {
      return <div><h2>Loading...</h2></div>;
    }

    const cards = this.state.referenda.map((ref, i) => {
      return <ReferendumCard key={i} referendumData={ref} />;
    });

    return <div id="referenda-wrapper">{cards}</div>;
  }
}

export default ReferendaPage;