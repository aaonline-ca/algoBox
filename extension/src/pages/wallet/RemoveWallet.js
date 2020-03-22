import React, { useContext, useState } from "react";

import { MDBBtn } from "mdbreact";
import { Row, Col, Toast } from "react-bootstrap";
import { makeStyles } from "@material-ui/core/styles";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";

import Algorand from "../../utils/Algorand";
import Session from "../../utils/Session";
import { DataContext } from "../../utils/DataProvider";
import EmptyRow from "../../utils/EmptyRow";

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
    flexWrap: "wrap"
  },
  formControl: {
    margin: 0,
    minWidth: "100%"
  },
  selectEmpty: {
    marginTop: theme.spacing(2)
  }
}));

const RemoveWallet = props => {
  const ctx = useContext(DataContext);

  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [wallets, setWallets] = useState(Session.wallets);
  const [address, setAddress] = useState(Session.wallet.address);

  const classes = useStyles();

  const onClick = async () => {
    ctx.setDisabled(true);

    try {
      if (Session.wallets.length === 1) {
        setShow(true);
        setError("Cannot delete only active wallet!");
      } else {
        await Session.removeWallet(address);
        setWallets(wallets.filter(e => e.address !== address));
        setAddress(Session.wallet.address);

        Algorand.getAccount(ctx.network, Session.wallet.address).then(
          ctx.setAccount
        );

        setShow(true);
        setError("Wallet removed!");
      }
    } catch (err) {
      setShow(true);
      setError("Some error occured!");
    }

    ctx.setDisabled(false);
  };

  return (
    <div>
      <Toast
        onClose={() => setShow(false)}
        show={show}
        delay={1500}
        style={{ position: "absolute", zIndex: 100 }}
        autohide
      >
        <Toast.Header>
          <strong className="mr-auto">{error}</strong>
        </Toast.Header>
      </Toast>
      <EmptyRow />
      <Row noGutters={true}>
        <Col xs="9" className="align-self-center mx-auto">
          <form className={classes.root} autoComplete="off">
            <FormControl className={classes.formControl}>
              <Select
                value={address}
                onChange={e => setAddress(e.target.value)}
              >
                {wallets.map((value, index) => (
                  <MenuItem key={index} value={value.address}>
                    {`${value.address.substring(0, 15)}...`}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </form>
        </Col>
      </Row>
      <EmptyRow />
      <Row>
        <Col xs="auto" className="mx-auto">
          <MDBBtn
            color="elegant"
            style={{ margin: "0" }}
            onClick={onClick}
            disabled={ctx.disabled}
          >
            Remove
          </MDBBtn>
        </Col>
      </Row>
      <EmptyRow />
    </div>
  );
};

export default RemoveWallet;
