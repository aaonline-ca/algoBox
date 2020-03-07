import React from "react";

import { Container, Row, Col } from "react-bootstrap";

import "./Content.css";

const Content = ({ header, children }) => (
  <Container className="algorand-content">
    <Row>
      <Col xs="9" md="9" className="px-0 algorand-content-header">
        {header}
      </Col>
    </Row>
    <div className="algorand-content-footer">{children}</div>
  </Container>
);

export default Content;
