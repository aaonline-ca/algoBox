import React from "react";

import Home from "../pages/home";
import Transfer from "../pages/transfer";
import History from "../pages/history";
import Wallet from "../pages/wallet";

const getComponent = page => {
  switch (page) {
    case "home":
    default:
      return <Home />;

    case "transfer":
      return <Transfer />;

    case "history":
      return <History />;

    case "wallet":
      return <Wallet />;
  }
};

export default getComponent;
