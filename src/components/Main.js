import React from "react";
import { Switch, Route } from "react-router-dom";
import EndorsementsPage from "./EndorsementsPageNew";
import ResultsPage from "./ResultsPage";
import SanctionsPage from "./SanctionsPage";
import ProfilePage from "./ProfilesPage";
import ReferendaPage from "./ReferendaPage";
import RelatedStories from "./RelatedStories";

class Main extends React.Component {
  render() {
    return (
      <div className="content">
        <Switch>
          <Route exact path="/" component={ProfilePage} />
          <Route path="/candidates" component={ProfilePage} />
          <Route path="/endorsements" component={EndorsementsPage} />
          <Route path="/results" component={ResultsPage} /> 
          <Route path="/violations" component={SanctionsPage} />
          <Route path="/referenda" component={ReferendaPage} />
          <Route path="/related" component={RelatedStories} />
        </Switch>
      </div>
    );
  }
}

export default Main;