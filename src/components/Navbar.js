import React from "react";
import "../sass/navbar.scss";
import MenuLink from "./MenuLink";

const navItems = {
  content: {
    links: [
      {
        name: "CANDIDATES",
        link: "/candidates",
      },
      {
        name: "VIOLATIONS",
        link: "/violations",
      },
      {
        name: "ENDORSEMENTS",
        link: "/endorsements",
      },
      // {
      //   name: "RESULTS",
      //   link: "/results",
      // },
      {
        name: "RELATED",
        link: "/related",
      },
    ],
  },
};

class Navbar extends React.Component {
  render() {
    let jsonKeys = Object.keys(navItems.content);
    let links = jsonKeys.map((t) =>
      navItems.content[t].map((e) => <MenuLink name={e.name} dest={e.link} />)
    );
    return (
      <nav>
        <header>USAC Elections 2021</header>
        <ul className="links">{links}</ul>
      </nav>
    );
  }
}

export default Navbar;