import React, { useState, useEffect } from "react";

import Cache from "./Cache";

import * as config from "../config.json";

const DataContext = React.createContext();

const DataProvider = ({ children }) => {
  const [page, setPage] = useState("home");
  const [input, setInput] = useState({});
  const [app, setApp] = useState({});
  const [wallet, setWallet] = useState(null);
  const [network, setNetwork] = useState("testnet");
  const [networks] = useState(config.algorand.networks);
  const [validation, setValidation] = useState({
    amount: false,
    toAddress: false
  });
  const [txDate, setTxDate] = useState(null);
  const [memo, setMemo] = useState(null);
  const [txs, setTxs] = useState({});

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
        networks,
        validation,
        setValidation,
        txDate,
        setTxDate,
        memo,
        setMemo,
        txs,
        setTxs
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

const DataConsumer = DataContext.Consumer;

export { DataConsumer };
export { DataContext };
export default DataProvider;
