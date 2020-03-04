import React, { useState, useEffect } from "react";

import Cache from "./Cache";

import * as config from "../config.json";

const DataContext = React.createContext();

const DataProvider = props => {
  const [page, setPage] = useState("home");
  const [input, setInput] = useState({});
  const [app, setApp] = useState({});
  const [wallet, setWallet] = useState(null);
  const [network, setNetwork] = useState("testnet");
  const [networks] = useState(config.algorand.networks);

  useEffect(() => {
    const fn = async () => {
      const _app = await Cache.get();
      setApp(_app);
    };

    fn();
  }, []);

  return (
    <DataContext.Provider
      value={{
        page,
        setPage,
        input,
        setInput,
        app,
        setApp,
        wallet,
        setWallet,
        network,
        setNetwork,
        networks
      }}
    >
      {props.children}
    </DataContext.Provider>
  );
};

const DataConsumer = DataContext.Consumer;

export { DataConsumer };
export { DataContext };
export default DataProvider;
