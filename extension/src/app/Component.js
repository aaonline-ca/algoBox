import React from "react";

import Home from "../pages/home";
import Transfer from "../pages/transfer";
import History from "../pages/history";
import Wallet from "../pages/wallet";
import ImportWallet from "../pages/wallet/ImportWallet";
import RemoveWallet from "../pages/wallet/RemoveWallet";
import ShareWallet from "../pages/wallet/ShareWallet";

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

    case "import-wallet":
      return <ImportWallet />;

    case "remove-wallet":
      return <RemoveWallet />;

    case "share-wallet":
      return <ShareWallet />;
  }
};

export default getComponent;
