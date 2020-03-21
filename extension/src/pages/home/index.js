import React, { useContext, useState, useEffect } from "react";

import cx from "classnames";
import { MDBBtn, MDBIcon } from "mdbreact";
import { Button, Card, Row, Col } from "react-bootstrap";

import Input from "../../utils/Input";
import Session from "../../utils/Session";
import Algorand from "../../utils/Algorand";
import { DataContext } from "../../utils/DataProvider";
import EmptyRow from "../../utils/EmptyRow";

import css from "./index.module.css";

const AppCard = ({ buttonText, onClick, cls }) => (
  <Card className={css.card}>
    <Card.Header className={cx(cls ? cls : "", css["card-header"])}>
      <Button variant="link" className={css["btn-link"]} onClick={onClick}>
        {buttonText}
      </Button>
    </Card.Header>
  </Card>
);

const AppCardHeader = ({ icon, text }) => (
  <Row>
    <Col xs="2" className="text-right">
      <MDBIcon icon={icon} />
    </Col>
    <Col xs="9" className="text-left">
      {text}
    </Col>
  </Row>
);

const Home = props => {
  const [ref, setRef] = useState(null);
  const [password, setPassword] = useState(null);
  const [register, setRegister] = useState(false);
  const [disabled, setDisabled] = useState(true);

  const ctx = useContext(DataContext);

  useEffect(() => {
    Session.isLoggedIn().then(network => {
      if (network) {
        ctx.setNetwork(network);
        ctx.setWallet(Session.wallet);
      }
    });
  }, [ctx.setNetwork, ctx.setWallet]);

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

  const logout = async () => {
    ctx.setWallet(null);
    ctx.setAccount(null);
    ctx.setTxs({});

    await Session.logout();
  };

  const reset = (value = false) => {
    if (ref) {
      ref.classList.remove("is-invalid");
      ref.classList.remove("is-valid");
    }

    setRef(null);
    setRegister(value);
    setPassword(null);
    setDisabled(true);
  };

  const items = [
    { icon: "exchange-alt", text: "Transfer", page: "transfer" },
    {
      icon: "wallet",
      text: "New Wallet",
      action: () => Session.register(download(), ctx.network)
    },
    { icon: "history", text: "History", page: "history" },
    { icon: "times", text: "Logout", action: logout }
  ];

  const onRegister = async () => {
    try {
      const wallet = download();
      ctx.setWallet(wallet);
      Session.register(wallet, ctx.network, password);
      reset();
    } catch (err) {
      console.log(err);
      ref.classList.add("is-invalid");
      ref.focus();
    }
  };

  const onLogin = async () => {
    try {
      const network = await Session.login(password);
      ctx.setNetwork(network);
      ctx.setWallet(Session.wallet);

      const account = await Algorand.getAccount(
        ctx.network,
        Session.wallet.address
      );
      ctx.setAccount(account);

      reset();
    } catch (err) {
      console.log(err);
      ref.classList.add("is-invalid");
      ref.focus();
    }
  };

  const LoginRegister = ({ text, value }) => (
    <Col
      className="text-center"
      style={{ cursor: "pointer" }}
      onClick={() => reset(value)}
    >
      {text}
    </Col>
  );

  const LoginRegisterBtn = ({ text, onClick }) => (
    <MDBBtn
      style={{
        margin: "0",
        paddingLeft: "80px",
        paddingRight: "80px"
      }}
      color="elegant"
      onClick={onClick}
      disabled={disabled}
    >
      {text}
    </MDBBtn>
  );

  return (
    <div>
      {ctx.wallet === null ? (
        <>
          <EmptyRow />
          <Row>
            <Col xs="auto" className="mx-auto">
              <Row>
                <Col>
                  <Input
                    hint="Password"
                    type="password"
                    value={password}
                    setValue={setPassword}
                    onChange={(ref, text) => {
                      setRef(ref);
                      setDisabled(!text);
                      return {};
                    }}
                  />
                </Col>
              </Row>
              <Row>
                <Col>
                  {register ? (
                    <LoginRegisterBtn text="Register" onClick={onRegister} />
                  ) : (
                    <LoginRegisterBtn text="Login" onClick={onLogin} />
                  )}
                </Col>
              </Row>
            </Col>
          </Row>
          <EmptyRow />
          <Row>
            <Col xs={{ span: 4, offset: 1 }} className="px-0">
              <hr />
            </Col>
            <Col
              xs={2}
              className="text-center px-0 align-self-center"
              style={{
                fontSize: "15px",
                color: "#999",
                fontStyle: "italic"
              }}
            >
              or
            </Col>
            <Col xs={{ span: 4, offset: 0 }} className="px-0">
              <hr />
            </Col>
          </Row>
          <Row>
            {register ? (
              <LoginRegister value={false} text="Login to your account" />
            ) : (
              <LoginRegister value={true} text="Create an account" />
            )}
          </Row>
          <EmptyRow rows={2} />
        </>
      ) : (
        items.map(({ icon, text, page, action }, index) => (
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
        ))
      )}
    </div>
  );
};

export default Home;
export { AppCard, AppCardHeader };
