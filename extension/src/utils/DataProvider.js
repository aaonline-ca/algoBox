import React, { useState, useEffect } from "react";

import Cache from "./Cache";

const DataContext = React.createContext();

const DataProvider = props => {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState("home");
  const [input, setInput] = useState({});
  const [app, setApp] = useState({});
  const [wallet, setWallet] = useState(null);
  const [network, setNetwork] = useState("testnet");

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
        user,
        setUser,
        page,
        setPage,
        input,
        setInput,
        app,
        setApp,
        wallet,
        setWallet,
        network,
        setNetwork
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
