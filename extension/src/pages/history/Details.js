import React from "react";

import { Row, Col, Spinner } from "react-bootstrap";
import ScrollArea from "react-scrollbar";

import Detail from "./Detail";

import EmptyRow from "../../utils/EmptyRow";

import "./Details.css";

const Page = ({ children }) => (
  <div>
    <EmptyRow />
    <Row className="algorand-history-row">
      <Col xs="auto" className="mx-auto">
        {children}
      </Col>
    </Row>
    <EmptyRow />
  </div>
);

const Details = ({ txs }) => (
  <div>
    <Row className="algorand-history-header">
      <Col xs="auto" className="mx-auto">
        <span>Transactions in this session</span>
      </Col>
    </Row>
    <EmptyRow />
    {txs && Object.keys(txs).length > 0 ? (
      <div>
        <ScrollArea
          speed={0.8}
          className="react-algorand-scrollarea"
          smoothScrolling={true}
          horizontal={false}
          minScrollSize
        >
          {Object.keys(txs).map((key, index) => (
            <Detail key={index} tx={txs[key]} />
          ))}
        </ScrollArea>
        <EmptyRow />
        <p
          style={{
            fontWeight: "400",
            fontSize: "10px",
            lineHeight: "12px"
          }}
        >
          * Pending transactions will be cancelled if popup is closed
        </p>
      </div>
    ) : txs !== null ? (
      <Page>
        <i className="fas fa-coins"></i>
        <p
          style={{
            fontWeight: "400",
            fontSize: "14px",
            lineHeight: "15px"
          }}
        >
          Nothing here! Make one transaction :)
        </p>
      </Page>
    ) : (
      <Page>
        <Spinner animation="border" />
      </Page>
    )}
  </div>
);

export default Details;
