import React, { useEffect, useContext, useState } from "react";

import { MDBBtn, MDBIcon } from "mdbreact";
import { Row, Col, Toast, OverlayTrigger, Tooltip } from "react-bootstrap";

import Algorand from "../../utils/Algorand";
import Worker from "../../utils/Worker";
import { DataContext } from "../../utils/DataProvider";
import Input from "../../utils/Input";
import Logo from "../../assets/logo_128.png";
import ScheduleDate from "./ScheduleDate";

import * as config from "../../config.json";

import "./TransferTo.css";

const ViewHistory = () => {
  const ctx = useContext(DataContext);

  return (
    <span style={{ float: "right" }}>
      <span className="algorand-transferto-history-mock">[&nbsp;</span>
      <span
        title="See all transactions made in this session"
        className="algorand-transferto-history"
        onClick={() => ctx.setPage("history")}
      >
        View History
      </span>
      <span className="algorand-transferto-history-mock">&nbsp;]</span>
    </span>
  );
};

const TransferTo = props => {
  const ctx = useContext(DataContext);

  const [show, setShow] = useState(false);

  useEffect(() => {
    Algorand.getAccount(ctx.network, ctx.wallet.address).then(ctx.setAccount);
  }, [ctx.setAccount, ctx.network, ctx.wallet.address]);

  const onChangeAddress = (ref, address) => {
    if (
      address === null ||
      address === undefined ||
      address.trim().length === 0
    ) {
      ctx.setValidation(validation => {
        return { ...validation, toAddress: false, toAddressValue: null };
      });
      return {};
    }

    const validate =
      Algorand.isValidAddress(address) &&
      (ctx.wallet ? ctx.wallet.address !== address : true);
    ctx.setValidation(validation => {
      return { ...validation, toAddress: validate, toAddressValue: address };
    });

    return { validate };
  };

  const transfer = async e => {
    ctx.setDisabled(true);

    try {
      // Set the tx params.
      let txParams = {
        to: ctx.validation.toAddressValue,
        amount: ctx.validation.amountValue,
        date: ctx.txDate ? ctx.txDate : new Date(),
        url: config.algorand.explorer[ctx.network]
      };

      if (ctx.memo && ctx.memo.trim().length > 0) {
        txParams.memo = ctx.memo;
      }

      console.log(txParams);

      // Send the transaction to the worker, to be processed.
      await Worker.sendTransaction({
        txParams,
        network: ctx.network,
        secretKey: ctx.wallet.sk
      });

      // Reset validation object.
      ctx.setValidation({
        amount: false,
        toAddress: false
      });

      ctx.setPage("history");
    } catch (err) {
      alert(err.message);
    }

    ctx.setDisabled(false);
  };

  const copyToClipboard = val => {
    const dummy = document.createElement("input");
    dummy.setAttribute("id", "dummy_id");
    document.body.appendChild(dummy);

    document.getElementById("dummy_id").value = val;
    dummy.select();

    document.execCommand("copy");
    document.body.removeChild(dummy);

    setShow(true);
  };

  return (
    <div>
      <Row>
        <Col className="align-self-center">
          <div>
            <p className="algorand-transferto-balance-p">
              Address:
              <ViewHistory />
              <span>{ctx.wallet ? ctx.wallet.address : null}</span>
              <OverlayTrigger
                key="top"
                placement="top"
                overlay={<Tooltip id="tooltip-top">Copy address</Tooltip>}
              >
                <MDBIcon
                  far
                  icon="clone"
                  style={{
                    float: "right",
                    marginTop: "-13px",
                    fontSize: "12px",
                    cursor: "pointer",
                    position: "relative"
                  }}
                  onClick={() => copyToClipboard(ctx.wallet.address)}
                />
              </OverlayTrigger>
              <Toast
                onClose={() => setShow(false)}
                show={show}
                delay={1000}
                autohide
              >
                <Toast.Header>
                  <strong className="mr-auto">Copied!</strong>
                </Toast.Header>
              </Toast>
            </p>
            <p className="algorand-transferto-balance-p">
              Balance:{" "}
              {ctx.account ? ctx.account.amount / Math.pow(10, 6) : "0.00"}
              &nbsp;
              <img src={Logo} alt="Logo" width="25px" height="25px" />
            </p>
          </div>
        </Col>
      </Row>
      <Row>
        <Col xs="auto" className="align-self-center">
          <ScheduleDate />
        </Col>
      </Row>
      <Row>
        <Col className="align-self-center">
          <form className="algorand-transferto-form" noValidate>
            <Input
              value={ctx.validation ? ctx.validation.toAddressValue : null}
              setValue={() => {}}
              label="To Address:"
              onChange={onChangeAddress}
              cls="algorand-transferto-input"
            />
            <Input
              value={ctx.memo}
              setValue={ctx.setMemo}
              label="Memo:"
              onChange={() => {}}
              cls="algorand-transferto-input"
            />
          </form>
        </Col>
      </Row>
      <Row>
        <Col className="text-center">
          <MDBBtn
            color="elegant"
            onClick={transfer}
            disabled={
              ctx.disabled ||
              !ctx.validation.amount ||
              !ctx.validation.toAddress
            }
          >
            {ctx.disabled ? (
              <i className="fas fa-spinner fa-spin"></i>
            ) : (
              "Transfer Now"
            )}
          </MDBBtn>
        </Col>
      </Row>
    </div>
  );
};

export default TransferTo;
