import React from "react";
import "../sass/modal.scss";

class ProfileOverlay extends React.Component {
  constructor(props) {
    super(props);
    this.handleKeyDown = this.handleKeyDown.bind(this);
  }

  componentDidMount() {
    document.body.addEventListener("keydown", this.handleKeyDown);
    document.body.classList.add("disable-scroll");
  }

  componentWillUnmount() {
    document.body.removeEventListener("keydown", this.handleKeyDown);
    document.body.classList.remove("disable-scroll");
  }

  handleKeyDown(e) {
    if (e.keyCode === 27) this.props.closeModal();
    if (e.keyCode === 37 && this.props.hasPrev) this.props.findPrev();
    if (e.keyCode === 39 && this.props.hasNext) this.props.findNext();
  }

  getAppropriatePlatformText(pageType) {
    if (pageType === "endorsements") {
      return (
        <div
          dangerouslySetInnerHTML={{
            __html: this.props.candidate.endorsement_text.replace(
              /(?:\r\n\r\n\r\n)/g,
              "</br></br>"
            ),
          }}
          className="candidateOverlayPlatform"
        />
      );
    } else {
      // platforms
      let bulletedPlatforms = this.props.candidate.platform.map((bullet) => {
        return <li>{bullet}</li>;
      });

      return (
        <div className="candidateOverlayPlatform">
          <ul>{bulletedPlatforms}</ul>
        </div>
      );
    }
  }

  render() {
    const {
      closeModal,
      hasNext,
      hasPrev,
      findNext,
      findPrev,
      src,
      candidate,
      pageType,
    } = this.props;

    // if (!src) {
    //   console.log("whut");
    //   return null;
    // }

    let endorsed;
    if (candidate.endorsed == "Yes") {
      endorsed = "ENDORSED";
    } else {
      endorsed = "NOT ENDORSED";
    }

    return (
      <div id="mount">
        <div className="modal-overlay" onClick={closeModal} />
        <div isopen={(!!src).toString()} className="modal">
          <div className="modal-controls">
            <a
              href="#"
              className="modal-close"
              onClick={closeModal}
              onKeyDown={this.handleKeyDown}
            >
              x
            </a>
            {hasPrev && (
              <a
                href="#"
                className="modal-prev arrow"
                onClick={findPrev}
                onKeyDown={this.handleKeyDown}
              >
                {"<"}
              </a>
            )}
            {hasNext && (
              <a
                href="#"
                className="modal-next arrow"
                onClick={findNext}
                onKeyDown={this.handleKeyDown}
              >
                {">"}
              </a>
            )}
          </div>
          <div className="candidateModalInfo">
            <div className="candidateModalImageContainer">
              <img src={src} className="candidateModalImage" />
            </div>
            <div className="candidateOverlay">
              {pageType === "endorsements" && endorsed == "ENDORSED" && (
                <div className="candidateOverlaySlate endorsedBar">
                  {endorsed}
                </div>
              )}
              {pageType === "endorsements" && endorsed == "NOT ENDORSED" && (
                <div className="candidateOverlaySlate notEndorsedBar">
                  {endorsed}
                </div>
              )}
              <div className="candidateOverlayName">
                {" "}
                {candidate.position &&
                  candidate.position + " | " + candidate.name &&
                  candidate.name}{" "}
              </div>
              <div className="candidateOverlaySlate">
                {" "}
                {candidate.slate && candidate.slate.toUpperCase()}{" "}
              </div>
              {this.getAppropriatePlatformText(pageType)}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ProfileOverlay;