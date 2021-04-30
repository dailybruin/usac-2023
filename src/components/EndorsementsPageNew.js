import React from "react";
import ProfileOverlay from "./ProfileOverlay.js";
import "../sass/ProfilesPage.scss";

let dataInfo;

class DropDown extends React.Component {
  constructor(...args) {
    super(...args);

    this.state = {
      active: false,
    };
    this.toggleDropDown = this.toggleDropDown.bind(this);
    this.handleSelection = this.handleSelection.bind(this);
    this.handleOutsideClick = this.handleOutsideClick.bind(this);
    this.handleDocumentClick = this.handleDocumentClick.bind(this);
    this.renderSelectionCont = this.renderSelectionCont.bind(this);
  }

  toggleDropDown(action, e) {
    switch (action) {
      case "close":
        this.setState({
          active: false,
        });
        document.removeEventListener("click", this.handleDocumentClick);
        break;
      default:
        this.setState({
          active: true,
        });
        document.addEventListener("click", this.handleDocumentClick);
        break;
    }
  }
  handleSelection(item) {
    this.props.onClick(item);
    this.toggleDropDown("close");
  }
  handleDocumentClick() {
    this.toggleDropDown("close");
  }
  handleOutsideClick(e) {
    e.nativeEvent.stopImmediatePropagation();
  }
  renderSelectionCont() {
    if (!this.state.active) return;

    return (
      <DropDownItems
        options={this.props.options}
        onClick={this.handleSelection}
        displayField={this.props.displayField}
      />
    );
  }

  render() {
    let wrapperClassName =
      "bd-dropdown" + (this.props.className ? " " + this.props.className : "");
    let caretClass = "fa fa-chevron-down";
    let toggle = "open";
    if (this.state.active) {
      caretClass = "fa fa-chevron-up";
      wrapperClassName = wrapperClassName + " __active";
      toggle = "close";
    }

    return (
      <div className={wrapperClassName} onClick={this.handleOutsideClick}>
        <div
          className="__control"
          onClick={this.toggleDropDown.bind(this, toggle)}
        >
          <div>{this.props.value}</div>
          <i className={caretClass} />
        </div>
        {this.renderSelectionCont()}
      </div>
    );
  }
}

class DropDownItems extends React.Component {
  constructor(...args) {
    super(...args);
  }
  render() {
    let options = this.props.options.map((item, idx) => {
      return (
        <li
          className="__item"
          key={idx}
          onClick={this.props.onClick.bind(this, item)}
        >
          {item.display}
        </li>
      );
    });
    return (
      <ul className="__options" onClick={this.props.onOutsideClick}>
        {options}
      </ul>
    );
  }
}

class ProfilePage extends React.Component {
  constructor(props) {
    super(props);
    var xmlHttp = new XMLHttpRequest();
    //xmlHttp.open( "GET", 'https://kerckhoff.dailybruin.com/api/packages/flatpages/usac.elections2018/', false ); // false for synchronous request
    //xmlHttp.send( null );

    this.state = {
      // candidates: JSON.parse(xmlHttp.responseText)['data']['data.aml']['profiles'],
      candidates: null,
      currentIndex: null,
      profiles: null,
      displayValue: "ALL CANDIDATES",
      dropdownOptions: null,
      images: null,
      loaded: false,
      totalCandidates: null,
    };
    this.handleSelection = this.handleSelection.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.findNext = this.findNext.bind(this);
    this.printPositions = this.printPositions.bind(this);
    this.findPrev = this.findPrev.bind(this);
  }

  getInfo() {
    fetch(
      "https://kerckhoff.dailybruin.com/api/packages/flatpages/flatpage.usac.2021elections/"
    )
      .then((res) => res.json())
      .then((data) => {
        let candidatesTemp = [];
        let imagesTemp = [];
        let dropdownOptions = [{ display: "ALL CANDIDATES", value: 0 }];
        let candidatesRes = data.data["data.aml"].profiles;
        candidatesRes.forEach(function (position, index) {
          dropdownOptions.push({
            display: position.position.toUpperCase(),
            value: index + 1,
          });
          let sortedCandidates = position.candidates.sort(function (a, b) {
            if (a.endorsed == "Yes") return -1;
            else return 1;
          });
          sortedCandidates.forEach(function (candidate) {
            candidate.position = position.position;
            candidatesTemp.push(candidate);
            // if available image on s3
            let potentialImage = null;
            if (data.images.s3[candidate.image])
              potentialImage = data.images.s3[candidate.image].url;
            if (potentialImage) {
              imagesTemp.push(potentialImage);
            } else {
              imagesTemp.push(candidate.image);
              console.log(candidate.image);
            }
          });
        });
        let profilesImgReplace = data.data["data.aml"].profiles;
        let endorsements = data.data["data.aml"].endorsements_live == "yes" ? true : false;
        let totalCount = 0;
        profilesImgReplace.forEach(function (position) {
          position.candidates.forEach(function (candidate) {
            totalCount++;
            let potentialImage = null;
            if (data.images.s3[candidate.image])
              potentialImage = data.images.s3[candidate.image].url;
            if (potentialImage) {
              candidate.image = potentialImage;
            } else {
              imagesTemp.push(candidate.image);
              console.log(candidate.image);
            }
          });
        });
        this.setState({
          images: imagesTemp,
          loaded: true,
          candidates: candidatesTemp,
          dropdownOptions: dropdownOptions,
          profiles: profilesImgReplace,
          totalCandidates: totalCount,
          e_live: endorsements,
        });
      });
  }

  componentDidMount() {
    this.getInfo();
  }

  handleSelection(item) {
    this.setState({
      displayValue: item.display,
    });
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
  // eventually use images from candidates array as inline style for background image
  // TODO: onclick handler passes in whole candidate
  printCandidates(candidates, offset) {
    const candidateCards = candidates.map(function (candidate, index) {
      let classcandidate = "notEndorsed red";
      if (candidate.endorsed == "Yes" || candidate.endorsed == "yes")
        classcandidate = "endorsed";
      let style = {
        backgroundImage: "url(" + candidate.image + ")",
      };
      classcandidate += " circle";
      return (
        <div
          className="candidate_card"
          onClick={(e) => this.openModal(e, offset + index)}
          key={index}
          index="{offset+index}"
        >
          <div className={classcandidate} style={style} />
          <div className="candidate-info">
            <div className="candidateName">{candidate.name}</div>
            <div className="candidateSlate">
              {candidate.slate && candidate.slate.toUpperCase()}
            </div>
          </div>
        </div>
      );
    }, this);
    return candidateCards;
  }
  printPositions() {
    let index = 0;
    const positions = this.state.profiles.map(function (positionInfo, i) {
      index += positionInfo.candidates.length;
      if (
        this.state.displayValue == positionInfo.position.toUpperCase() ||
        this.state.displayValue == "ALL CANDIDATES"
      )
        return (
          <div className="positionRow" key={i}>
            <div className="positionName">{positionInfo.position}</div>
            <div className="positionCandidates">
              {this.printCandidates(
                positionInfo.candidates,
                index - positionInfo.candidates.length
              )}
            </div>
          </div>
        );
    }, this);
    return positions;
  }

  render() {
    if (this.state.loaded && this.state.e_live) {
      return (
        <div>
          <div className="dropdown-width">
            <DropDown
              options={this.state.dropdownOptions}
              value={this.state.displayValue}
              onClick={this.handleSelection}
            />
          </div>
          {this.printPositions()}
          {this.state.currentIndex !== null && (
            <ProfileOverlay
              closeModal={this.closeModal}
              findPrev={this.findPrev}
              findNext={this.findNext}
              hasPrev={this.state.currentIndex > 0}
              hasNext={this.state.currentIndex + 1 < this.state.totalCandidates}
              src={this.state.images[this.state.currentIndex]}
              candidate={this.state.candidates[this.state.currentIndex]}
              pageType="endorsements"
            />
          )}
        </div>
      );
    } else { 
      return (
        <div>
          <h2>Please check back Friday</h2>
        </div>
      );/*
      return (
        <div>
          <h2>Loading...</h2>
        </div>
      ); */
    }
    
  }
}

export default ProfilePage;