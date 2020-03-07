import React, { useContext } from "react";

import cx from "classnames";
import { MDBBtn, MDBIcon } from "mdbreact";
import { Button, Card, Row, Col } from "react-bootstrap";

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
    <Col md="2" className="text-right">
      <MDBIcon icon={icon} />
    </Col>
    <Col md="9" className="text-left">
      {text}
    </Col>
  </Row>
);

const Home = props => {
  const items = [
    { icon: "home", text: "Transfer", page: "transfer" },
    { icon: "lock", text: "History", page: "history" },
    { icon: "times", text: "Logout", action: () => ctx.setWallet(null) }
  ];

  const ctx = useContext(DataContext);

  const login = () => {
    const file = document.createElement("input");
    file.style.display = "none";
    file.type = "file";
    file.name = "file";
    file.accept = ".txt";
    document.getElementById("root").appendChild(file);

    file.onchange = e => {
      const f = e.target.files[0];

      const fr = new FileReader();
      fr.onload = async evt => {
        try {
          const wallet = Algorand.getWallet(evt.target.result);
          ctx.setWallet(wallet);
          Algorand.getAccount(ctx.network, wallet.address).then(ctx.setAccount);

          document.getElementById("root").removeChild(file);
        } catch (err) {
          alert("Invalid ALGO wallet file!");
        }
      };
      fr.readAsText(f);
    };
    file.click();
  };

  const createWallet = () => {
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

    ctx.setWallet(wallet);
  };

  return (
    <div>
      {ctx.wallet === null ? (
        <>
          <EmptyRow />
          <Row>
            <Col md="auto" className="mx-auto">
              <MDBBtn
                style={{ paddingLeft: "75px", paddingRight: "75px" }}
                color="elegant"
                onClick={login}
              >
                Login
              </MDBBtn>
            </Col>
          </Row>
          <Row fluid={true}>
            <Col md={{ span: 4, offset: 1 }} className="px-0">
              <hr />
            </Col>
            <Col
              md={2}
              className="text-center px-0 align-self-center"
              style={{
                fontSize: "15px",
                color: "#999",
                fontStyle: "italic"
              }}
            >
              or
            </Col>
            <Col md={{ span: 4, offset: 0 }} className="px-0">
              <hr />
            </Col>
          </Row>
          <Row>
            <Col
              className="text-center"
              style={{ cursor: "pointer" }}
              onClick={createWallet}
            >
              Create an account
            </Col>
          </Row>
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
