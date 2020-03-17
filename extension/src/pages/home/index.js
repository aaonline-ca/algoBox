import React, { useContext, useState } from "react";

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
  const [fn, setFn] = useState(null);
  const [ref, setRef] = useState(null);
  const [password, setPassword] = useState(null);
  const [register, setRegister] = useState(false);
  const [disabled, setDisabled] = useState(true);

  const items = [
    { icon: "home", text: "Transfer", page: "transfer" },
    { icon: "lock", text: "History", page: "history" },
    { icon: "times", text: "Logout", action: () => ctx.setWallet(null) }
  ];

  const ctx = useContext(DataContext);

  const reset = () => {
    setFn(null);
    setRef(null);
    setRegister(false);
    setPassword(null);
    setDisabled(true);
  };

  const onRegister = async () => {
    try {
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

      Session.register(password, wallet);
      ctx.setWallet(wallet);
      reset();
    } catch (err) {
      console.log(err);
      ref.classList.add("is-invalid");
      ref.focus();
    }
  };

  const onLogin = async () => {
    try {
      ref.classList.add("is-invalid");
      ref.focus();

      await Session.login(password);
      ctx.setWallet(Session.wallets[0]);
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
      onClick={() => {
        if (fn) fn();
        setRegister(value);
      }}
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
                    value={password}
                    hint="Password"
                    type="password"
                    onChange={(text, ref, setText) => {
                      setFn(setText);
                      setRef(ref);
                      setPassword(text);
                      setDisabled(text ? false : true);
                      return { validate: undefined };
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
          <EmptyRow />
          <EmptyRow />
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
