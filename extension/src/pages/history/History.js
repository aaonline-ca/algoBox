import React, { useContext, useEffect, useState } from "react";

import Details from "./Details";

import Algorand from "../../utils/Algorand";
import { DataContext } from "../../utils/DataProvider";

const History = props => {
  const ctx = useContext(DataContext);

  const [txs, setTxs] = useState(null);

  useEffect(() => {
    const fn = async () => {
      // Only completed transactions here.
      const tx = await Algorand.getTransactions(
        ctx.network,
        ctx.wallet.address
      );
      setTxs(tx);
    };

    fn();
  }, [ctx.network, ctx.wallet]);

  return (
    <div>
      <Details txs={txs} />
    </div>
  );
};

export default History;
