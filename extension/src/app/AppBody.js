import React, { useContext } from "react";

import getComponent from "./Component";
import { DataContext } from "../utils/DataProvider";

const AppBody = props => {
  const ctx = useContext(DataContext);

  switch (ctx.page) {
    case "home":
    case "wallet":
      return <div>{getComponent(ctx.page)}</div>;

    default:
      return <div className="algobox">{getComponent(ctx.page)}</div>;
  }
};

export default AppBody;
