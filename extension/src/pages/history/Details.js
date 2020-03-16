import React from "react";

import { Row, Col } from "react-bootstrap";
import ScrollArea from "react-scrollbar";

import Detail from "./Detail";

import EmptyRow from "../../utils/EmptyRow";

import "./Details.css";

const Details = ({ txs }) => (
  <div>
    <Row className="algorand-history-header">
      <Col>
        <span>Transactions in this session</span>
      </Col>
    </Row>
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
    ) : (
      <div>
        <EmptyRow />
        <Row className="algorand-history-row">
          <Col>
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
          </Col>
        </Row>
        <EmptyRow />
      </div>
    )}
  </div>
);

export default Details;
