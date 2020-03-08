import React, { useEffect, useContext } from "react";

import { MDBBtn } from "mdbreact";
import { Row, Col } from "react-bootstrap";

import Algorand from "../../utils/Algorand";
import { DataContext } from "../../utils/DataProvider";
import Input from "../../utils/Input";
import Logo from "../../assets/logo_128.png";
import ScheduleDate from "./ScheduleDate";

import * as config from "../../config.json";

import "./TransferTo.css";

const TransferTo = props => {
  const ctx = useContext(DataContext);

  useEffect(() => {
    Algorand.getAccount(ctx.network, ctx.wallet.address).then(ctx.setAccount);
  }, [ctx.network]);

  const onChangeAddress = address => {
    if (
      address === null ||
      address === undefined ||
      address.trim().length === 0
    ) {
      ctx.setValidation(validation => {
        return { ...validation, toAddress: false };
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

  const onChangeMemo = memo => {
    ctx.setMemo(memo);
    return {};
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

      if (
        ctx.memo !== null &&
        ctx.memo !== undefined &&
        ctx.memo.trim().length > 0
      ) {
        txParams.memo = ctx.memo;
      }

      console.log(txParams);

      // Send the transaction to the worker, be processed.
      ctx.worker.postMessage({
        network: ctx.network,
        txParams: txParams,
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

  return (
    <div>
      <Row>
        <Col className="align-self-center">
          <div>
            <p className="algorand-transferto-balance-p">
              Address:
              <span style={{ float: "right" }}>
                <span className="algorand-transferto-history-mock">
                  [&nbsp;
                </span>
                <span
                  title="See all transactions made in this session"
                  className="algorand-transferto-history"
                  onClick={() => ctx.setPage("history")}
                >
                  View History
                </span>
                <span className="algorand-transferto-history-mock">
                  &nbsp;]
                </span>
              </span>
              <span>{ctx.wallet ? ctx.wallet.address : null}</span>
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
        <Col md="auto" className="align-self-center">
          <ScheduleDate />
        </Col>
      </Row>
      <Row>
        <Col className="align-self-center">
          <form className="algorand-transferto-form" noValidate>
            <Input
              label="To Address:"
              onChange={onChangeAddress}
              cls="algorand-transferto-input"
            />
            <Input
              label="Memo:"
              onChange={onChangeMemo}
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
