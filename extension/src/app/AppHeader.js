import React from "react";

import { Card } from "react-bootstrap";

import LogoImg from "../assets/logo_128.png";

import config from "../config.json";

const Header = () => (
  <div>
    <img src={LogoImg} style={{ width: "32px", height: "32px" }} alt="" />
    <span style={{ position: "relative", top: "2px" }}>
      &nbsp;&nbsp;{config.app.name}
    </span>
  </div>
);

const AppHeader = props => (
  <div>
    <Card.Header>
      <Header />
    </Card.Header>
  </div>
);

export default AppHeader;
