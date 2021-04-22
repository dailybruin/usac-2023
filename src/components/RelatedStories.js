import React from "react";
import "../sass/related.scss";

class RelatedStories extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    fetch(
      "https://kerckhoff.dailybruin.com/api/packages/flatpages/interactive.2020.usac.related"
    )
      .then((res) => res.json())
      .then((data) => {
        this.setState({
          related: data.data["data.aml"].related,
        });
      });
  }

  render() {
    const storyList = this.state.related ? (
      this.state.related.map((rs) => {
        return (
          <a href={rs.url} key={rs.title} target="_blank">
            <li>
              <div className="left">
                <h3>{rs.title}</h3>
                <p>{rs.blurb}</p>
              </div>
              <div className="right">
                <img src={rs.thumbnail} />
              </div>
            </li>
          </a>
        );
      })
    ) : (
      <h2>Loading</h2>
    );

    return (
      <div className="content related-wrap">
        <ul className="related">{storyList}</ul>
      </div>
    );
  }
}

export default RelatedStories;