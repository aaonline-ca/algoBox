import React from "react";

import { Row, Col } from "react-bootstrap";

const EmptyRow = props => {
  let rows = props.rows || 1;
  rows = [...Array(rows).keys()];

  return (
    <>
      {rows.map((_, index) => (
        <Row key={index} style={{ height: "15px" }}>
          <Col>&nbsp;</Col>
        </Row>
      ))}
    </>
  );
};

export default EmptyRow;
