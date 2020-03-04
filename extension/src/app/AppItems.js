import React, { useState, useEffect } from "react";

import { MDBIcon } from "mdbreact";
import { Card, Row, Col } from "react-bootstrap";
import ScrollArea from "react-scrollbar";

import Extension from "../utils/Extension";

import css from "./AppItems.module.css";
import appCss from "../index.module.css";

const AppItem = ({ img, item }) => (
  <Card.Header className={appCss["algobox-card-header"]}>
    <Row className={appCss.row}>
      <Col md="2" className={appCss["col-md-2"]}>
        {img ? (
          <img width="30" src={img} alt="" />
        ) : (
          <MDBIcon icon="shield-alt" style={{ fontSize: "30px" }} />
        )}
      </Col>
      <Col md="10" className={appCss["col-md-10"]} style={{ fontSize: "14px" }}>
        <Row className={appCss.row}>
          <Col className={appCss.col}>{item.label}</Col>
        </Row>
        <Row className={appCss.row}>
          <Col className={appCss.col}>{item.bvk}</Col>
        </Row>
      </Col>
    </Row>
  </Card.Header>
);

const AppItems = ({ items }) => {
  const [img, setImg] = useState("");

  useEffect(() => {
    Extension.getFavicon()
      .then(setImg)
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (
      window.chrome.browserAction &&
      Array.isArray(items) &&
      items.length > 0
    ) {
      window.chrome.browserAction.setBadgeBackgroundColor({
        color: [83, 79, 79, 255]
      });
      window.chrome.browserAction.setBadgeText({
        text: items.length.toString()
      });
    }
  }, [items]);

  return (
    <ScrollArea
      speed={0.8}
      className={css["algobox-scrollarea"]}
      smoothScrolling={true}
      horizontal={false}
      minScrollSize
    >
      <Card.Header
        className={appCss["algobox-card-header"]}
        style={{ padding: "0" }}
      >
        {items
          ? items.map((item, index) => <AppItem img={img} item={item} />)
          : null}
      </Card.Header>
    </ScrollArea>
  );
};

export default AppItems;
