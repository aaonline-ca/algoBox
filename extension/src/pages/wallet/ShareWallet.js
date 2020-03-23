import React, { useContext, useState } from "react";

import { MDBBtn } from "mdbreact";
import QRCode from "qrcode.react";
import { Row, Col } from "react-bootstrap";

import { DataContext } from "../../utils/DataProvider";
import EmptyRow from "../../utils/EmptyRow";

const ShareWallet = props => {
  const ctx = useContext(DataContext);

  const onClick = () => {
    const canvas = document.getElementById("algobox-wallet-qr");
    const pngUrl = canvas
      .toDataURL("image/png")
      .replace("image/png", "image/octet-stream");

    const download = document.createElement("a");
    download.href = pngUrl;
    download.download = `algorand-${ctx.wallet.address}.png`;
    document.body.appendChild(download);
    download.click();
    document.body.removeChild(download);
  };

  return (
    <div>
      <EmptyRow />
      <QRCode
        id="algobox-wallet-qr"
        value={ctx.wallet.address}
        size={290}
        level={"H"}
        includeMargin={true}
      />
      <Row>
        <Col xs="auto" className="mx-auto">
          <MDBBtn color="elegant" style={{ margin: "0" }} onClick={onClick}>
            Download
          </MDBBtn>
        </Col>
      </Row>
      <EmptyRow />
    </div>
  );
};

export default ShareWallet;
