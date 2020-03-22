import React from "react";

import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardDateTimePicker
} from "@material-ui/pickers";

import "./FormDate.css";

const FormDate = ({ label, date, setDate }) => (
  <MuiPickersUtilsProvider utils={DateFnsUtils}>
    <KeyboardDateTimePicker
      disableToolbar
      variant="inline"
      format="MMM d, yyyy HH:mm"
      label={label}
      value={date ? date : null}
      disablePast={true}
      onChange={setDate}
      autoOk={true}
      style={{ marginBottom: "15px" }}
    />
  </MuiPickersUtilsProvider>
);

export default FormDate;
