import styles from "./BookingForm.module.css";
import { Fragment, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file
import {
  checkLogin,
  getActiveUserInfor,
  getDataOfHotel,
  getHotelDataForSearching,
  postBookingData,
} from "../../utils/common";
import DropdownList from "./DropdownList";
import { format } from "date-fns";

const BookingForm = ({ hotelID }) => {
  // Use some hooks to handle data for booking page
  const [resData, setResData] = useState();
  const [hotelInfor, setHotelInfor] = useState(null);
  const [roomForBooking, setRoomForBooking] = useState(null);
  const [isSelectedDateRange, setIsSelectedDateRange] = useState(false);
  const [selectedValue, setSelectedValue] = useState("");
  const [isDisabled, setIsDisabled] = useState(true);
  const [totalBill, setTotalBill] = useState(0);
  const [selectedRoomArr, setSelectedRoomArr] = useState([]);
  const fullNameRef = useRef();
  const emailRef = useRef();
  const phoneNumberRef = useRef();
  const cardNumberRef = useRef();

  // Using state for DateRange
  const [date, setDate] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);

  // Define some variables to store data
  let paymentMethod;
  const totalDay = date[0].endDate.getDate() - date[0].startDate.getDate() + 1;

  // This function to set disable status for button
  function setDisableForButton() {
    const fullName = fullNameRef.current.value;
    const email = emailRef.current.value;
    const phoneNumber = phoneNumberRef.current.value;
    const cardNumber = cardNumberRef.current.value;

    const disable =
      !roomForBooking ||
      selectedValue === "" ||
      totalBill === 0 ||
      fullName === "" ||
      email === "" ||
      phoneNumber === "" ||
      cardNumber === "";

    setIsDisabled(disable);
  }

  // This function to handle onChange event for checkbox to get booking information
  function onChangeCheckboxHandler(event, roomID, roomNumber, price) {
    let newTotalBill, indexOrderRoom;

    // If checkbox is checked
    if (event.target.checked) {
      // If selectedRoomArr is not empty array
      if (selectedRoomArr.length > 0) {
        indexOrderRoom = selectedRoomArr.findIndex((i) => i.roomID === roomID);

        // If found roomID of booked room (indexOrderRoom >= 0) in "selectedRoomArr" then update
        if (indexOrderRoom >= 0) {
          // Update "selectedRoomArr"
          selectedRoomArr[indexOrderRoom].roomOrder.push(roomNumber);
          setSelectedRoomArr(selectedRoomArr);
        } else {
          // If not found roomID of booked room in "selectedRoomArr" then push to "selectedRoomArr"
          selectedRoomArr.push({ roomID: roomID, roomOrder: [roomNumber] });
        }
      } else {
        // If selectedRoomArr is empty array then push to "selectedRoomArr"
        selectedRoomArr.push({ roomID, roomOrder: [roomNumber] });
      }

      // Recalculate the value of totalBill when user check to the checkbox
      newTotalBill = totalBill + price * totalDay;
    } else {
      // If checkbox is unchecked then update "selectedRoomArr"
      indexOrderRoom = selectedRoomArr.findIndex((i) => i.roomID === roomID);
      selectedRoomArr[indexOrderRoom] = {
        ...selectedRoomArr[indexOrderRoom],
        roomOrder: selectedRoomArr[indexOrderRoom].roomOrder.filter(
          (j) => j !== roomNumber
        ),
      };
      setSelectedRoomArr(selectedRoomArr);

      // Recalculate the value of totalBill when user uncheck the checkbox
      newTotalBill = totalBill - price * totalDay;
    }

    // Filter "selectedRoomArr": remove items in "selectedRoomArr" which have "roomOrder" property is empty array
    const listBookedRoom = selectedRoomArr.filter(
      (item) => item.roomOrder.length > 0
    );
    setSelectedRoomArr(listBookedRoom);

    // Update value of "totalBill"
    setTotalBill(newTotalBill);
  }

  // This function to get status of DropdownList
  function getSelectedValueFunction(currentValue) {
    if (currentValue !== "") {
      setSelectedValue(currentValue);
    }
  }

  // This function to handle click event on "Reserve or Booking Now" or "Reserve Now" button
  function bookingButtonHandler() {
    const bookingInfor = {
      user: {
        fullName: fullNameRef.current.value,
        email: emailRef.current.value,
        phoneNumber: phoneNumberRef.current.value,
        cardNumber: cardNumberRef.current.value,
      },
      hotel: hotelID,
      rooms: selectedRoomArr,
      dateStart: format(date[0].startDate, "yyyy-MM-dd'T'HH:mm:ss'Z'"), // Xử lý lỗi lệch múi giờ khi lưu ngày xuống database (nếu lệch múi giờ thì ngày lưu xuống database sẽ bị giảm 1 ngày so với thực tế)
      dateEnd: format(date[0].endDate, "yyyy-MM-dd'T'HH:mm:ss'Z'"), // Xử lý lỗi lệch múi giờ khi lưu ngày xuống database (nếu lệch múi giờ thì ngày lưu xuống database sẽ bị giảm 1 ngày so với thực tế)
      totalBill: totalBill,
      paymentMethod: selectedValue,
    };

    // Call API to post booking infor to server
    postBookingData(bookingInfor);
  }

  // This useEffect() hook to get hotel information from database
  useEffect(() => {
    // Get information of Hotel
    getDataOfHotel()
      .then((data) => {
        const hotel = data.find((item) => item._id === hotelID);
        setHotelInfor(hotel);
      })
      .catch((err) => console.log("Error Information: ", err));

    // Get information of active user
    getActiveUserInfor()
      .then((data) => {
        setResData(data);
      })
      .catch((err) => console.log("Error Information: ", err));
  }, []);

  // This useEffect() hook to get available room for booking
  useEffect(() => {
    const searchParams = JSON.parse(localStorage.getItem("searchParams"));
    if (searchParams) {
      getHotelDataForSearching(
        searchParams.city,
        date[0].startDate,
        date[0].endDate,
        searchParams.totalPeople,
        searchParams.roomQuantity,
        searchParams.minPrice,
        searchParams.maxPrice
      )
        .then((data) => {
          if (data) {
            const hotelForBooking = data.availableHotels.find(
              (item) => item._id === hotelID
            );

            let roomData = hotelForBooking ? hotelForBooking.rooms : null;
            roomData = roomData?.map((i) => ({
              ...i,
              roomNumbers: i.roomNumbers.map((j) => ({
                roomName: j,
                isChecked: false,
              })),
            }));

            // Update "roomForBooking" status
            setRoomForBooking(roomData);

            // reset value of "totalBill" status to 0 (zero)
            setTotalBill(0);
          }
        })
        .catch((err) => console.log("Error Information: ", err));
    } else {
      checkLogin();
    }
  }, [date[0].startDate.toString(), date[0].endDate.toString()]);

  // This useEffect() hook to set value for "isDisabled" status
  useEffect(() => {
    // Enable/Disable booking button
    setDisableForButton();

    // Check if "roomForBooking" = "null" then set "totalBill" = 0
    if (!roomForBooking) setTotalBill(0);
  });

  // Defines list room element: "listRoomEl"
  const listRoomEL = roomForBooking?.map((room) => (
    <div key={room._id} className="col-6">
      <div className={`${styles["room-item"]} row`}>
        <div className="col-8">
          <span className={styles["room-title"]}>{room.title}</span>
          <span className={styles["room-desc"]}>{room.desc}</span>
          <span className={styles["max-people"]}>
            Max people: <strong>{room.maxPeople}</strong>
          </span>
          <p className={styles["room-price"]}>{`$${room.price}`}</p>
        </div>
        <div className="col-4 d-flex gap-3 align-items-center">
          {room.roomNumbers.map((number) => (
            <div key={number.roomName} className={styles["room-container"]}>
              <div className={styles["room-number"]}>
                <label
                  style={{ display: "block" }}
                  className={styles["child"]}
                  htmlFor={`${room._id}-${number.roomName}`}
                >
                  {number.roomName}
                </label>
                <input
                  className={styles["child"]}
                  type="checkbox"
                  id={`${room._id}-${number.roomName}`}
                  checked={number.isChecked}
                  onChange={(event) => {
                    onChangeCheckboxHandler(
                      event,
                      room._id,
                      number.roomName,
                      room.price
                    );
                    number.isChecked = !number.isChecked;
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  ));

  // Defines "Reverse or Book Now" button
  const reverseOrBookNowButton = isDisabled ? (
    <span
      className={`${styles["optional-button"]} ${styles["disable-btns"]} ${styles["disable"]}`}
    >
      Reverse or Book Now
    </span>
  ) : (
    <Link
      to="/transactions"
      className={`${styles["optional-button"]} ${styles["booking-btn"]}`}
      onClick={bookingButtonHandler}
    >
      Reserve or Book Now!
    </Link>
  );

  // Defines "Reverse Now" button
  const reverseNowButton = isDisabled ? (
    <span
      className={`${styles["optional-button"]} ${styles["disable-btn"]} ${styles["disable"]}`}
    >
      Reverse Now
    </span>
  ) : (
    <Link
      to="/transactions"
      className={`${styles["optional-button"]} ${styles["reserve-btn"]} ${styles["booking-btn"]}`}
      onClick={bookingButtonHandler}
    >
      Reserve Now!
    </Link>
  );

  return (
    <Fragment>
      <div>
        <div className={styles["body-container"]}>
          {/* Section-1: Hotel Information */}
          <div className={styles["hotel-info-container"]}>
            {hotelInfor && (
              <div className={`${styles["hotel-infor"]}`}>
                <div className={styles["hotel-detail"]}>
                  <p className={styles["hotel-name"]}>{hotelInfor.name}</p>
                  <p className={styles["hotel-desc"]}>{hotelInfor.desc}</p>
                </div>
                <div className={`${styles["frame-price-detail"]}`}>
                  <p>
                    ${hotelInfor.cheapestPrice} <span>(1 nights)</span>
                  </p>
                  {reverseOrBookNowButton}
                </div>
              </div>
            )}
          </div>

          {/* Section-2: Booking Information */}
          <div className={`${styles["booking-infor"]}`}>
            <div className={styles["date-range"]}>
              <p className={styles["title"]}>Dates</p>
              <DateRange
                editableDateInputs={true}
                moveRangeOnFirstSelection={false}
                className={styles["myDateRange"]}
                minDate={new Date()}
                onChange={(item) => {
                  setDate([item.selection]);
                  setIsSelectedDateRange(true);
                }}
                ranges={date}
              />
            </div>
            <div className={styles["user-infor"]}>
              <p className={styles["title"]}>Reserve Infor</p>
              <div className={styles["infor"]}>
                <p>Your Full Name:</p>
                <input
                  type="text"
                  placeholder="Full Name"
                  ref={fullNameRef}
                  onKeyUp={setDisableForButton}
                />

                <p>Your Email:</p>
                <input
                  type="text"
                  placeholder="Email"
                  defaultValue={resData?.session.user?.email}
                  ref={emailRef}
                  onKeyUp={setDisableForButton}
                />

                <p>Your Phone Number:</p>
                <input
                  type="text"
                  placeholder="Phone Number"
                  ref={phoneNumberRef}
                  onKeyUp={setDisableForButton}
                />

                <p>Your Identity Card Number:</p>
                <input
                  type="text"
                  placeholder="Card Number"
                  ref={cardNumberRef}
                  onKeyUp={setDisableForButton}
                />
              </div>
            </div>
          </div>

          {/* Section-3: Room Information For Booking */}
          <div className={`${styles["room-booking-container"]}`}>
            <p className={styles["title"]}>Select Rooms</p>
            {isSelectedDateRange && (
              <div className="row">
                {!roomForBooking && (
                  <p className={styles["text-note"]}>
                    No found any rooms for booking!
                  </p>
                )}

                {roomForBooking && listRoomEL}
                <div className={styles["booking-container"]}>
                  <p className={styles["total-bill"]}>
                    Total Bill: ${totalBill.toLocaleString("vi-VN")}
                  </p>
                  <div className={styles["booking-control"]}>
                    <DropdownList getSelectedValue={getSelectedValueFunction} />
                    {reverseNowButton}
                  </div>
                </div>
              </div>
            )}
            {!isSelectedDateRange && (
              <p className={styles["text-note"]}>
                Select in the "Date Range" to book room please!
              </p>
            )}
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default BookingForm;
