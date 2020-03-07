import React, { useContext } from "react";

import getComponent from "./Component";
import { DataContext } from "../utils/DataProvider";

const AppBody = props => {
  const ctx = useContext(DataContext);

  if (ctx.page === "home") {
    return <div>{getComponent(ctx.page)}</div>;
  }

  return <div className="algobox">{getComponent(ctx.page)}</div>;
};

export default AppBody;
