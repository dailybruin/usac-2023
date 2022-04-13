import React from "react";
import ReferendumCard from "./ReferendumCard";
import ProfileOverlay from "./ProfileOverlay";

class EndorsementsPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
      currentIndex: null,
      endorsedLive: false,
    };
    this.endorsedCandidates = [];
    this.images = [];
  }

  getCandidateInfo() {
    fetch(
      "https://kerckhoff.dailybruin.com/api/packages/flatpages/flatpage.2022.usac-elections/"
    )
      .then((res) => res.json())
      .then((data) => {
        // Go through the candidates that have endorsed field set to true
        const profiles = data.data["data.aml"].profiles;
        var endorsedCandidates = [];
        var nonendorsedCandidates = [];
        var endorsedIndex = -1; // Works correctly for selection
        var nonEndorsedIndex = 10;
        var images = [];
        profiles.map((pos) => {
          pos.candidates.map((candidate) => {
            if (
              candidate["endorsed"] == "Yes" ||
              candidate["endorsed"] == "yes" ||
              candidate["endorsed"] == "y" ||
              candidate["endorsed"] == "Y"
            ) {
              // save candidates info for the position in object state only if the candidate is endorsed
              endorsedCandidates[pos.position] = candidate;
              endorsedIndex += 1;
              candidate.position = pos.position;
              candidate.index = endorsedIndex;
              endorsedCandidates.push(candidate);
              let potentialImage = data.images.s3[candidate.image]
                ? data.images.s3[candidate.image]["url"]
                : null;
              images[endorsedIndex] = potentialImage;
              candidate.image = potentialImage;
            } else {
              nonendorsedCandidates[pos.position] = candidate;
              nonEndorsedIndex += 1;
              candidate.position = pos.position;
              candidate.index = nonEndorsedIndex;
              nonendorsedCandidates.push(candidate);
              let potentialImage = data.images.s3[candidate.image]
                ? data.images.s3[candidate.image]["url"]
                : null;
              images[nonEndorsedIndex] = potentialImage;
              candidate.image = potentialImage;
            }
          });
        });
        this.images = images;
        endorsedCandidates = endorsedCandidates.concat(nonendorsedCandidates);
        this.endorsedCandidates = endorsedCandidates;
        let endorsedLive = false;
          //data.data["data.aml"].endorsements_live == "yes" ? true : false;
        this.setState({ loaded: true, endorsedLive: endorsedLive });

        this.closeModal = this.closeModal.bind(this);
        this.findNext = this.findNext.bind(this);
        this.findPrev = this.findPrev.bind(this);
      });
  }

  componentDidMount() {
    this.getCandidateInfo();
  }

  openModal(e, index) {
    this.setState({ currentIndex: index });
  }

  closeModal(e) {
    if (e != undefined) {
      e.preventDefault();
    }
    this.setState({ currentIndex: null });
  }

  findPrev(e) {
    if (e != undefined) {
      e.preventDefault();
    }
    this.setState((prevState) => ({
      currentIndex: prevState.currentIndex - 1,
    }));
  }
  findNext(e) {
    if (e != undefined) {
      e.preventDefault();
    }
    this.setState((prevState) => ({
      currentIndex: prevState.currentIndex + 1,
    }));
  }

  printCandidates() {
    var index = 0;
    const candidateCards = this.endorsedCandidates.map((candidate) => {
      let classcandidate;
      if (candidate.endorsed == "Yes") {
        classcandidate = "endorsed circle";
      } else {
        classcandidate = "notEndorsed red circle";
      }
      let style = {
        backgroundImage: "url(" + candidate.image + ")",
      };
      return (
        <div
          className="candidate_card"
          onClick={(e) => this.openModal(e, candidate.index)}
          key={candidate.index}
          index="{offset+index}"
        >
          <div className="endorsedPositionName">{candidate.position}</div>

          <div className={classcandidate} style={style} />
          <div className="candidate-info">
            <div className="candidateName">{candidate.name}</div>
            <div className="candidateSlate">
              {candidate.slate.toUpperCase()}
            </div>
          </div>
        </div>
      );
    }, this);

    return candidateCards;
  }

  render() {
    if (true) { //this.state.loaded && this.state.endorsedLive) {
      return (
        <div>
          <div className="positionRow" key={0}>
            <div className="positionCandidates"> {this.printCandidates()} </div>
          </div>
          {this.state.currentIndex !== null && (
            <ProfileOverlay
              closeModal={this.closeModal}
              findPrev={this.findPrev}
              findNext={this.findNext}
              hasPrev={this.state.currentIndex > 0}
              hasNext={
                this.state.currentIndex + 1 < this.endorsedCandidates.length
              }
              src={this.images[this.state.currentIndex]}
              candidate={this.endorsedCandidates[this.state.currentIndex]}
              pageType="endorsements"
            />
          )}
          
        </div>
      );
    } else /* if (this.state.loaded && !this.state.endorsedLive)*/ {
      return (
        <div>
          <h2>Please check back Thursday </h2>
        </div>
      );
    } else {
      return (
        <div>
          <h2>Loading... </h2>
        </div>
      );
    }
  }
}

export default EndorsementsPage;