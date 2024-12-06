import { format } from "date-fns";
import styles from "./SearchInput.module.css";
import { useContext, useRef, useState } from "react";
import { DateRange } from "react-date-range";
import { useNavigate } from "react-router-dom";

// Import CSS for DateRange
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file
import DataContext from "../../../../context/DataContext";
import { checkLogin } from "../../../../utils/common";

export default function SearchInput() {
  // Using useNavigate() hook
  const navigate = useNavigate();

  // Create three states below to control show/hide "Calendar Input" and "Calendar DateRange"
  const [isShowInputCalendar, setIsShowInputCalendar] = useState(false);
  const [isSelectedDateRange, setIsSelectedDateRange] = useState(false);
  const [isKeepShowDateRange, setIsKeepShowDateRange] = useState(false);

  // Using useRef() hook get value of search input
  const cityRef = useRef();
  const dateRef = useRef();
  const numOrderRoomRef = useRef();

  // Using state for Show/Hide DateRange
  const [showDateRange, setShowDateRange] = useState(false);

  // Using state for DateRange
  const [date, setDate] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);

  // Variables to store first date and last date when user select in DateRange
  let firstDate, lastDate;
  firstDate = date[0].startDate;
  lastDate = date[0].endDate;

  // Using useContext() hook
  const dataCTX = useContext(DataContext);

  // Defines this function to get hotel data for searching
  async function searchHandler() {
    const city = cityRef.current.value;
    const dateStart = dateRef.current.value === "" ? null : firstDate;
    const dateEnd = dateRef.current.value === "" ? null : lastDate;
    const numberOrderArr = numOrderRoomRef.current.value.split("-");
    const totalPeople = numberOrderArr[0] * 1 + numberOrderArr[1] * 1;
    const roomQuantity = numberOrderArr[2] * 1;

    const isLoggedIn = await checkLogin();
    if (isLoggedIn) {
      // Store value of search params to context
      dataCTX.setSearchParamsFunction(
        city,
        dateStart,
        dateEnd,
        totalPeople,
        roomQuantity
      );

      navigate("/search");
    } else {
      dataCTX.setSearchParamsFunction(null, null, null, null, null);
    }
  }

  // This function to handle onclick event of Input Calendar
  function onClickHandlerCalendarInput() {
    setShowDateRange(!showDateRange);
    if (!isSelectedDateRange) setIsShowInputCalendar(!isShowInputCalendar);
  }

  // This function to handle onBlur event of Input Calendar
  function onBlurHandlerCalendarInput() {
    if (!isKeepShowDateRange) {
      setShowDateRange(false);
      if (!isSelectedDateRange) setIsShowInputCalendar(false);
    }
  }

  function validateInput() {
    // Get value of room input by "numOrderRoomRef"
    const input = numOrderRoomRef.current.value;

    //  This regex express to validate for room input: "2 adult - 1 children - 1 room" = "2-1-1"
    const regex = /^\d+-\d+-\d+$/;

    // Check value of input and show information
    if (input !== "" && !regex.test(input)) {
      alert(
        'Input value is invalid! \nPlease enter in the following format: "number-number-number"\nExample: 2-1-1'
      );
      numOrderRoomRef.current.value = "";
    }
  }

  return (
    <div>
      <div className={styles["input-search"]}>
        {/* Destination input: Where are you going? */}
        <span>
          <i className="fa fa-bed" />
          <input type="text" placeholder="Where are you going?" ref={cityRef} />
        </span>

        {/* Calendar input */}
        {/* Change state to show/hide DateRange when user click on calendar input */}
        <span
          onClick={onClickHandlerCalendarInput}
          onBlur={onBlurHandlerCalendarInput}
        >
          <i className="fa fa-calendar" />
          <input
            type="text"
            placeholder="24/06/2022 to 24/06/2022"
            ref={dateRef}
            value={
              isShowInputCalendar
                ? `${format(firstDate, "dd/MM/yyyy")} to ${format(
                    lastDate,
                    "dd/MM/yyyy"
                  )}`
                : ""
            }
            readOnly={true}
          />
        </span>

        {/* Room booking input */}
        <span>
          <i className="fa fa-male" />
          <input
            type="text"
            placeholder="1 adult - 0 children - 1 room"
            ref={numOrderRoomRef}
            onBlur={validateInput}
          />
        </span>
      </div>

      {/* Search button */}
      <button
        className={styles["btn-search"]}
        // to="/search"
        onClick={searchHandler}
      >
        Search
      </button>

      {/* Show/Hide DateRange */}
      {showDateRange && (
        <div
          onMouseOver={() => setIsKeepShowDateRange(true)}
          onMouseLeave={() => setIsKeepShowDateRange(false)}
        >
          <DateRange
            editableDateInputs={true}
            moveRangeOnFirstSelection={false}
            className={styles["myDateRange"]}
            minDate={new Date()}
            onChange={(item) => {
              setDate([item.selection]);
              setShowDateRange(false);
              setIsShowInputCalendar(true);
              setIsKeepShowDateRange(false);
              setIsSelectedDateRange(true);
            }}
            ranges={date}
          />
        </div>
      )}
    </div>
  );
}
