import React from "react";

import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker
} from "@material-ui/pickers";

import "./FormDate.css";

const FormDate = ({ label, date, setDate }) => (
  <MuiPickersUtilsProvider utils={DateFnsUtils}>
    <KeyboardDatePicker
      disableToolbar
      variant="inline"
      format="MMM d, yyyy"
      label={label}
      value={date ? date : null}
      disablePast={true}
      onChange={setDate}
      autoOk={true}
      style={{ marginBottom: "35px" }}
    />
  </MuiPickersUtilsProvider>
);

export default FormDate;
