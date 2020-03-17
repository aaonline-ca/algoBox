import React, { useState } from "react";

import { MDBInput } from "mdbreact";

import { DataConsumer } from "./DataProvider";

const Input = props => {
  const [ref, setRef] = useState(null);

  const onChange = (target, text) => {
    props.setValue(text);

    if (props.onChange) {
      const { validate } = props.onChange(ref, text);

      if (validate === undefined) {
        target.classList.remove("is-valid");
        target.classList.remove("is-invalid");
      } else if (validate === false) {
        target.classList.remove("is-valid");
        target.classList.add("is-invalid");
      } else {
        target.classList.remove("is-invalid");
        target.classList.add("is-valid");
      }
    }
  };

  return (
    <DataConsumer>
      {ctx => (
        <MDBInput
          inputRef={setRef}
          type={props.type ? props.type : "text"}
          value={props.value ? props.value : ""}
          hint={props.hint}
          label={props.label}
          onChange={e => onChange(e.target, e.target.value)}
          disabled={ctx.disabled}
          size={props.size ? props.size : "sm"}
          icon={props.icon}
          className={props.cls}
        />
      )}
    </DataConsumer>
  );
};

export default Input;
