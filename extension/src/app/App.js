import React from "react";

import { Card } from "react-bootstrap";

import AppHeader from "./AppHeader";
import AppBody from "./AppBody";

import appCss from "../index.module.css";

import config from "../config.json";

const App = props => (
  <Card style={{ width: "300px", userSelect: "none" }}>
    <AppHeader />
    <AppBody />
    <Card.Header
      style={{ fontSize: "14px", borderTop: "1px solid rgba(0,0,0,.125)" }}
      className={appCss["algobox-card-header"]}
    >
      &copy; Robin Thomas |{" "}
      <a href={config.app.github} rel="noopener noreferrer" target="_blank">
        Github
      </a>
    </Card.Header>
  </Card>
);

export default App;
