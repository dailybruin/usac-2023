import React from "react";
import Navbar from "./components/Navbar";
import Main from "./components/Main";
import "./sass/main.scss";

class App extends React.Component {
  render () {
    return (
      <div>
        <a href="https://dailybruin.com/" target="_blank"><img className="logo" src="https://features.dailybruin.com/2018/bruinsinseattle/img/dblogobw.png" /></a>
        <Navbar />
        <Main />
        <div className="footer content candidateSlate">
          Page developed by Mattie Sanseverino. Copyright 2021 Daily Bruin.
        </div>
      </div>
    );
  }
}

export default App;