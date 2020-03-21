import React, { useContext, useEffect, useState, forwardRef } from "react";

import { MDBIcon } from "mdbreact";
import { Row, Col, Popover, Spinner } from "react-bootstrap";
import ScrollArea from "react-scrollbar";

import EmptyRow from "../utils/EmptyRow";
import { AppCard } from "../pages/home";
import Algorand from "../utils/Algorand";
import Session from "../utils/Session";
import { DataContext } from "../utils/DataProvider";

import LogoImg from "../assets/logo_128.png";

const AccountSpinner = () => (
  <>
    <EmptyRow />
    <Row>
      <Col xs="auto" className="mx-auto">
        <Spinner animation="border" />
      </Col>
    </Row>
    <EmptyRow />
  </>
);

const AccountIcon = forwardRef((props, ref) => {
  return (
    <span
      {...props}
      ref={ref}
      style={{
        height: "35px",
        width: "35px",
        padding: "2px",
        marginTop: "3px",
        cursor: "pointer",
        borderRadius: "50%",
        display: "inline-block",
        backgroundColor: "black",
        backgroundClip: "content-box",
        border: "2px solid black"
      }}
    />
  );
});

const Accounts = ({ network, wallets, style, setShow, ...props }) => {
  const [accounts, setAccounts] = useState([]);

  const ctx = useContext(DataContext);

  useEffect(() => {
    const fn = async () => {
      let _accounts = [];

      for (const wallet of wallets) {
        const account = await Algorand.getAccount(network, wallet.address);

        _accounts.push({
          address: wallet.address,
          balance: account ? account.amount / Math.pow(10, 6) : "0.00",
          active: wallet.address === ctx.wallet.address
        });
      }

      setAccounts(_accounts);
    };

    fn();
  }, [ctx.wallet, wallets, network]);

  return (
    <Popover {...props} style={{ width: "250px", left: "15px", top: "15px" }}>
      <Popover.Title as="h3">My Accounts</Popover.Title>
      <Popover.Content style={{ padding: "0" }}>
        {accounts.length === 0 ? (
          <AccountSpinner />
        ) : (
          <ScrollArea
            speed={0.8}
            smoothScrolling={true}
            className="react-algorand-scrollarea"
            horizontal={false}
            minScrollSize
          >
            {accounts.map((item, index) => (
              <AppCard
                key={index}
                cls={item.active ? "algobox-appcard-active" : ""}
                buttonText={
                  <Row key={index} noGutters={true}>
                    <Col xs="3" className="align-self-center">
                      <AccountIcon />
                    </Col>
                    <Col xs="6" className="align-self-center text-left">
                      <Row noGutters={true} style={{ fontSize: "11px" }}>
                        <Col>
                          <span title={item.address}>{`${item.address.substring(
                            0,
                            14
                          )}...`}</span>
                        </Col>
                      </Row>
                      <Row noGutters={true}>
                        <Col>
                          <span style={{ opacity: "0.6" }}>{item.balance}</span>
                          <img
                            src={LogoImg}
                            width="15"
                            height="15"
                            alt=""
                            style={{ marginTop: "-1px" }}
                          />
                        </Col>
                      </Row>
                    </Col>
                    {item.active ? (
                      <Col xs="3" className="align-self-center text-center">
                        <MDBIcon icon="wallet" />
                      </Col>
                    ) : null}
                  </Row>
                }
                onClick={() => {
                  if (ctx.wallet.address !== item.address) {
                    const wallet = Session.setAccount(item.address);
                    ctx.setWallet(wallet);
                  }
                  setShow(false);
                }}
              />
            ))}
          </ScrollArea>
        )}
      </Popover.Content>
    </Popover>
  );
};

export { AccountIcon, Accounts };
