import React, { useContext } from "react";

import { AppCard, AppCardHeader } from "../home";
import Algorand from "../../utils/Algorand";
import Session from "../../utils/Session";
import { DataContext } from "../../utils/DataProvider";

const Wallet = props => {
  const ctx = useContext(DataContext);

  const download = () => {
    const wallet = Algorand.createWallet();

    const ele = document.createElement("a");
    ele.setAttribute(
      "href",
      "data:text/plain;charset=utf-8," + encodeURIComponent(wallet.mnemonic)
    );
    ele.setAttribute("download", `algorand-wallet-${wallet.address}.txt`);
    ele.style.display = "none";
    document.body.appendChild(ele);

    ele.click();

    document.body.removeChild(ele);

    return wallet;
  };

  const items = [
    {
      icon: "wallet",
      text: "New Wallet",
      action: () => Session.register(download(), ctx.network)
    },
    { icon: "file-import", text: "Import Wallet", page: "import-wallet" },
    { icon: "trash-alt", text: "Remove Wallet", page: "remove-wallet" },
    { icon: "share", text: "Share Wallet", page: "share-wallet" }
  ];

  return items.map(({ icon, text, page, action }, index) => (
    <AppCard
      key={index}
      buttonText={<AppCardHeader icon={icon} text={text} />}
      onClick={() => {
        if (page) {
          ctx.setPage(page);
        } else {
          action();
        }
      }}
    />
  ));
};

export default Wallet;
