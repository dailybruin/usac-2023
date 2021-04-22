import React from "react";
import { NavLink } from "react-router-dom";

function MenuLink(props) {
  return (
    
      <NavLink
        activeStyle={{ "color": "#1780CC" }}
        to={props.dest}
      >
        {props.name}
      </NavLink>
      
    
  );
}

export default MenuLink;
