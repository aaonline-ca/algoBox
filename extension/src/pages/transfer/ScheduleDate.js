import React, { useContext, useState } from "react";

import FormDate from "../../utils/FormDate";
import { DataContext } from "../../utils/DataProvider";

import "./ScheduleDate.css";

const ScheduleDate = () => {
  const ctx = useContext(DataContext);

  const [isActive, setIsActive] = useState(false);

  const onClick = () => {
    if (!isActive) {
      ctx.setTxDate(new Date());
      setIsActive(true);
    } else {
      ctx.setTxDate(null);
      setIsActive(false);
    }
  };

  return (
    <>
      <div className="custom-control custom-switch" onClick={onClick}>
        <input
          type="checkbox"
          className="custom-control-input"
          checked={isActive}
          onChange={() => ctx.setTxDate(new Date())}
        />
        <label
          className="algorand-transferto-schedule-label custom-control-label"
          htmlFor="customSwitches"
          title="Schedule this transaction for future"
        >
          <p>Schedule this transaction</p>
        </label>
      </div>
      {isActive ? (
        <FormDate date={ctx.txDate} setDate={ctx.setTxDate} label={""} />
      ) : null}
    </>
  );
};

export default ScheduleDate;
