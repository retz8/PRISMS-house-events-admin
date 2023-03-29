import DatePicker from "react-datepicker";
import React, { useEffect, useState } from "react";
import styles from "./DatePickerComponent.module.css";

export default function DatePickerComponent({ setDate, phDate }) {
  const [displayDate, setDisplayDate] = useState(
    phDate ? new Date(phDate) : new Date()
  );

  const CustomDateInput = ({ value, onClick }) => (
    <button type="button" className={styles.dateInputButton} onClick={onClick}>
      {value}
    </button>
  );

  const handleDateChange = (date) => {
    setDisplayDate(date);
    setDate(date);
  };

  return (
    <div style={{ paddingLeft: "5px" }}>
      <DatePicker
        selected={displayDate}
        onChange={handleDateChange}
        showTimeSelect
        timeFormat="HH:mm"
        dateFormat="yyyy-MM-dd HH:mm"
        timeIntervals={60}
        customInput={<CustomDateInput />}
      />
    </div>
  );
}
