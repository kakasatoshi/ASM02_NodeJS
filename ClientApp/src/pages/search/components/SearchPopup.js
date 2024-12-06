import { useRef, useState } from "react";
import styles from "./Body.module.css";
import { format } from "date-fns";
import { DateRange } from "react-date-range";

// Import CSS for DateRange
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file
import { getHotelDataForSearching } from "../../../utils/common";

export default function SearchPopup({ sendHotelData }) {
  // Using useRef() hook get value of search input
  const cityRef = useRef();
  const dateRef = useRef();
  const minPriceRef = useRef();
  const maxPriceRef = useRef();
  const adultRef = useRef();
  const childrenRef = useRef();
  const roomQuantityRef = useRef();

  // Create three states below to control show/hide "Calendar Input" and "Calendar DateRange"
  const [isShowInputCalendar, setIsShowInputCalendar] = useState(false);
  const [isSelectedDateRange, setIsSelectedDateRange] = useState(false);
  const [isKeepShowDateRange, setIsKeepShowDateRange] = useState(false);

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

  // Defines this function to get hotel data for searching
  async function searchHandler() {
    const city = cityRef.current.value;
    const dateStart = dateRef.current.value === "" ? null : firstDate;
    const dateEnd = dateRef.current.value === "" ? null : lastDate;
    const adultQuantity = adultRef.current.value;
    const childrenQuantity = childrenRef.current.value;
    const totalPeople = adultQuantity * 1 + childrenQuantity * 1;
    const roomQuantity = roomQuantityRef.current.value * 1;
    const minPrice = minPriceRef.current.value * 1;
    const maxPrice = maxPriceRef.current.value * 1;

    if (
      city !== "" &&
      dateStart !== null &&
      adultQuantity !== "" &&
      childrenQuantity !== "" &&
      roomQuantity !== "" &&
      minPrice > 0 &&
      maxPrice > minPrice
    ) {
      const hotelDataResult = await getHotelDataForSearching(
        city,
        dateStart,
        dateEnd,
        totalPeople,
        roomQuantity,
        minPrice,
        maxPrice
      );

      // Truyền dữ liệu "hotelDataResult" lên component cha "Body.jsx" của trang "Search.jsx"
      sendHotelData(hotelDataResult);
    } else if (maxPrice < minPrice) {
      alert('"Min price per night" must be less than "Max price per night"');
    }
  }

  function onSubmitHandler(e) {
    e.preventDefault();
  }

  return (
    <div>
      <form onSubmit={onSubmitHandler}>
        <div className={styles["search-popup"]}>
          {/* Title */}
          <h4>Search</h4>

          {/* Destination input */}
          <div>
            <p>Destination</p>
            <input
              type="text"
              placeholder="Where are you going?"
              required
              ref={cityRef}
            />
          </div>

          {/* Checkin date input */}
          <div>
            <p>Check-in Date</p>
            <span
              onClick={onClickHandlerCalendarInput}
              onBlur={onBlurHandlerCalendarInput}
            >
              <input
                className={styles["input-date-range"]}
                type="text"
                placeholder="24/06/2022 to 24/06/2022"
                value={
                  isShowInputCalendar
                    ? `${format(firstDate, "dd/MM/yyyy")} to ${format(
                        lastDate,
                        "dd/MM/yyyy"
                      )}`
                    : ""
                }
                onChange={() => {}}
                required
                ref={dateRef}
              />
            </span>
          </div>

          {/* Option value to search */}
          <div>
            <p>Options</p>
            <div className={`${styles["div-option"]} row`}>
              <div className="col-8">Min price per night</div>
              <input
                type="number"
                className="col-4"
                required
                ref={minPriceRef}
                min={1}
              />
              <div className="col-8">Max price per night</div>
              <input
                type="number"
                className="col-4"
                required
                ref={maxPriceRef}
                min={1}
              />
              <div className="col-8">Adult</div>
              <input
                type="number"
                className="col-4"
                placeholder="1"
                required
                ref={adultRef}
                min={0}
              />
              <div className="col-8">Children</div>
              <input
                type="number"
                className="col-4"
                placeholder="0"
                required
                ref={childrenRef}
                min={0}
              />
              <div className="col-8">Room</div>
              <input
                type="number"
                className="col-4"
                placeholder="1"
                required
                ref={roomQuantityRef}
                min={1}
              />
            </div>
          </div>

          {/* Search button */}
          <button className={styles["search-btn"]} onClick={searchHandler}>
            Search
          </button>
        </div>
      </form>

      {/* Show/Hide DateRange */}
      {showDateRange && (
        <div
          className={styles["date-range"]}
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
