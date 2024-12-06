import React, { useContext, useEffect, useState } from "react";
import Styles from "./DropdownList.module.css";

export default function DropdownList({ getSelectedValue }) {
  const [defaultValueStyle, setDefaultValueStyle] = useState("default-style");
  const [selectedValue, setSelectedValue] = useState("");
  const dropdownListValue = [
    "Master Card",
    "Credit Cart",
    "Visa Cart",
    "Cash Payment",
    "Check Payment",
    "Banking Payment",
  ];

  useEffect(() => {
    getSelectedValue(selectedValue);
  }, [selectedValue]);

  // This function to handle onChange event of "DropdownList"
  function onChangeHandler(event) {
    // Remove CSS class "default-style" for style of text default in dropdown list
    if (defaultValueStyle) setDefaultValueStyle(undefined);

    // Set selected value for "DropdownList"
    const currentSelectValue = event.target.value;
    setSelectedValue(currentSelectValue);
  }

  return (
    <div>
      <select
        className={`${Styles["select-option"]} ${Styles[defaultValueStyle]}`}
        onChange={onChangeHandler}
        value={selectedValue}
      >
        <option hidden={true}>Select Payment Method</option>
        {dropdownListValue.map((item) => (
          <option
            key={item.id ? item.id : item}
            value={item.id ? item.id : item}
          >
            {item.id ? item.name : item}
          </option>
        ))}
      </select>
    </div>
  );
}
