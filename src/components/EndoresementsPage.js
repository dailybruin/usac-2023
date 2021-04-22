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
      "https://kerckhoff.dailybruin.com/api/packages/flatpages/interactive.2020.profiles.endorsements/"
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
              candidate["endorsed"] == "yes"
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
        let endorsedLive =
          data.data["data.aml"].endorsements_live == "yes" ? true : false;
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
    if (this.state.loaded && this.state.endorsedLive) {
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
          {/* <hr />
          <h2 className="referendum-title">
            Not Endorsed - International student representative referendum
          </h2>
          <div className="candidateOverlayPlatform">
            <p>
              International students face very real issues on campus. Creating
              another position on the Undergraduate Students Association
              Council, however, is merely a Band-Aid solution to the
              council&rsquo;s shortcomings. For this reason, the board does not
              endorse this referendum.{" "}
            </p>
            <p>
              Advocates for the international student representative position
              are right to point out that international students face increasing
              struggles due to tightening immigration policies under President
              Donald Trump&rsquo;s administration, lack of state financial aid
              and the cultural shocks that come from studying at a university
              thousands of miles from home.{" "}
            </p>
            <p>
              But creating another position on the council fails to address a
              fundamental issue: USAC&rsquo;s structure withholds it from truly
              representing the many communities on this campus.{" "}
            </p>
            <p>
              Instead of creating a new position for every community that has
              unique struggles, council members and the student body must reform
              USAC to be a senate-style system, which exists in many
              universities such as UC Berkeley. A senate system with more
              positions would allow individuals from different communities to be
              elected and fight for the needs of the campus&rsquo; various
              groups.
            </p>
            <p>
              Certainly, an additional council position for international
              students might help address some of the issues the community
              faces. After all, international students are diverse and deserve
              more attention, support and even representation in the
              undergraduate student government.{" "}
            </p>
            <p>
              But this referendum is not the way to ensure such representation
              in the long term. In 2014, this campus was embroiled in the same
              debate about whether USAC should add council positions for each
              underrepresented campus community when it was faced with the
              choice of whether to add a transfer student representative to the
              council table. And the answer hasn&rsquo;t changed: The council
              table in its current structure doesn&rsquo;t have enough room to
              add a seat for every underrepresented community on campus.{" "}
            </p>
            <p>
              To create a system that fairly represents the undergraduate
              community, the student body must instead begin the long and
              difficult journey of restructuring USAC into a senate-styled
              system. Passing this referendum only pushes that burden onto
              future Bruins while perpetuating the council&rsquo;s
              inaccessibility to numerous groups on campus.{" "}
            </p>
          </div> */}
        </div>
      );
    } else if (this.state.loaded && !this.state.endorsedLive) {
      return (
        <div>
          <h2>Please check back Monday </h2>
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