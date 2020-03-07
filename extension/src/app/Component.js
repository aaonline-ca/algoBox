import React from "react";

import Home from "../pages/home";
import History from "../pages/history";

const getComponent = page => {
  switch (page) {
    case "home":
    default:
      return <Home />;

    case "history":
      return <History />;
  }
};

export default getComponent;
