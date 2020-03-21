import React, { useContext, useState, useRef } from "react";

import { Row, Col, Card, Overlay } from "react-bootstrap";
import { makeStyles } from "@material-ui/core/styles";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";

import { AccountIcon, Accounts } from "./Account";
import { AppCard, AppCardHeader } from "../pages/home";
import Algorand from "../utils/Algorand";
import Session from "../utils/Session";
import { DataContext } from "../utils/DataProvider";

import LogoImg from "../assets/logo_128.png";
import config from "../config.json";

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

const Header = () => {
  const ctx = useContext(DataContext);

  const [show, setShow] = useState(false);
  const target = useRef(null);

  const classes = useStyles();

  const onNetworkChange = network => {
    ctx.setNetwork(network);
    Algorand.getAccount(network, ctx.wallet.address).then(ctx.setAccount);
  };

  return (
    <Row>
      <Col xs="auto" className="align-self-center">
        <img src={LogoImg} style={{ width: "32px", height: "32px" }} alt="" />
        <span style={{ position: "relative", top: "2px" }}>
          &nbsp;&nbsp;{config.app.name}
        </span>
      </Col>
      {ctx.wallet ? (
        <Col>
          <Row noGutters={true}>
            <Col xs="8" className="align-self-center">
              <form className={classes.root} autoComplete="off">
                <FormControl className={classes.formControl}>
                  <Select
                    value={ctx.network}
                    onChange={e => onNetworkChange(e.target.value)}
                  >
                    {ctx.networks.map((value, index) => (
                      <MenuItem key={index} value={value}>
                        {value}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </form>
            </Col>
            <Col xs="4" className="align-self-center text-right">
              <AccountIcon ref={target} onClick={() => setShow(!show)} />
              <Overlay show={show} target={target.current} placement="left">
                <Accounts
                  setShow={setShow}
                  network={ctx.network}
                  wallets={Session.wallets}
                />
              </Overlay>
            </Col>
          </Row>
        </Col>
      ) : null}
    </Row>
  );
};

const AppHeader = props => {
  const ctx = useContext(DataContext);

  return ctx.page !== "home" ? (
    <div style={{ borderBottom: "1px solid rgba(0,0,0,.125)" }}>
      <AppCard
        cls="algobox-back-btn"
        buttonText={<AppCardHeader icon="angle-left" text="Back" />}
        onClick={() => ctx.setPage("home")}
      />
    </div>
  ) : (
    <Card.Header>
      <Header />
    </Card.Header>
  );
};

export default AppHeader;
