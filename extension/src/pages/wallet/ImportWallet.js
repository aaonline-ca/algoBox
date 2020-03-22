import React, { useContext, useState } from "react";

import { MDBBtn } from "mdbreact";

import Input from "../../utils/Input";
import Algorand from "../../utils/Algorand";
import Session from "../../utils/Session";
import { DataContext } from "../../utils/DataProvider";
import EmptyRow from "../../utils/EmptyRow";

const Wallet = props => {
  const ctx = useContext(DataContext);

  const [ref, setRef] = useState(null);
  const [mnemonic, setMnemonic] = useState(null);

  const onClick = async () => {
    try {
      const wallet = Algorand.createWallet(mnemonic);

      const wallets = Session.wallets.filter(e => e.address === wallet.address);
      if (wallets.length === 0) {
        await Session.register(wallet, ctx.network);
      }
      ctx.setPage("home");
    } catch (err) {
      ref.classList.remove("is-invalid");
    }
  };

  return (
    <div>
      <EmptyRow />
      <Input
        type="textarea"
        label="Wallet mnemonic"
        rows="3"
        value={mnemonic}
        setValue={setMnemonic}
        onChange={_ref => {
          setRef(_ref);
          return {};
        }}
      />
      <MDBBtn color="elegant" style={{ margin: "0" }} onClick={onClick}>
        Import
      </MDBBtn>
      <EmptyRow />
    </div>
  );
};

export default Wallet;
