import { useLoaderData, useNavigate } from "react-router-dom";
import styles from "./NewRoom.module.css";
import { useRef, useState } from "react";
import { checkLogin, postAddNewRoom } from "../../utils/common";

export default function NewRoom() {
  const [selectHotel, setSelectHotel] = useState("");
  const listHotels = useLoaderData();
  const navigate = useNavigate();

  // Define refs for input
  const titleRef = useRef();
  const priceRef = useRef();
  const descRef = useRef();
  const maxPeopleRef = useRef();
  const roomRef = useRef();
  const hotelRef = useRef();

  // This function to handle onBlur event of "Room" input
  function onBlurHandlerRoomInput() {
    // Lấy giá trị từ input
    const input = roomRef.current.value;

    // This regex expression to validate value of room input, follow format: "201, 202, 203"
    const regex = /^[\w\s]+(,[\w\s]+)*$/;

    // Check input value and show information
    if (input !== "" && !regex.test(input)) {
      alert(
        "Input value is invalid! \nGive comma between room numbers\nExample: 101, 102, 103"
      );
      roomRef.current.value = "";
    }
  }

  // This function to validate input value of form
  function validateInputForm(refInput, messageText) {
    if (refInput.current.value.trim() === "") {
      alert(messageText);
      return "stop";
    }
  }

  // This function to handle event onChange of select input
  function onChangeListHotelHandler(event) {
    const currentValue = event.target.value;
    setSelectHotel(currentValue);
  }

  // This function to handle onclick event of "Send" button
  async function onClickHandlerSendButton() {
    // Define an input array
    const valueInputArr = [
      { valueInput: titleRef, messageText: 'Enter value for "Title" input' },
      { valueInput: priceRef, messageText: 'Enter value for "Price" input' },
      {
        valueInput: descRef,
        messageText: 'Enter value for "Description" input',
      },
      {
        valueInput: maxPeopleRef,
        messageText: 'Enter value for "Max People" input',
      },
      { valueInput: roomRef, messageText: 'Enter value for "Rooms" input' },
      {
        valueInput: hotelRef,
        messageText: 'Select value for "Choose a hotel" input',
      },
    ];

    // Validate for "Price" input
    if (priceRef.current.value < 1) {
      alert('Value of "Price" input must be greater than or equal to 1');
      return;
    }

    // Validate for "Max People" input
    if (maxPeopleRef.current.value < 1 || maxPeopleRef.current.value > 6) {
      alert(
        'Value of "Max People" input must be greater than or equal to 1 \nand less than or equal to 6'
      );
      return;
    }

    // Validate for other inputs
    for (let i = 0; i < valueInputArr.length; i++) {
      const validateResult = validateInputForm(
        valueInputArr[i].valueInput,
        valueInputArr[i].messageText
      );
      if (validateResult === "stop") return;
    }

    const requestData = {
      roomData: {
        createdAt: new Date(),
        desc: descRef.current.value,
        maxPeople: maxPeopleRef.current.value,
        price: priceRef.current.value,
        roomNumbers: roomRef.current.value.replace(/\s+/g, "").split(","),
        title: titleRef.current.value,
        updatedAt: new Date(),
      },
      hotelID: hotelRef.current.value,
    };

    // Add new room to a Hotel
    const isLoggedIn = await checkLogin();
    if (isLoggedIn) {
      await postAddNewRoom(requestData);
      navigate("/room");
    } else {
      navigate("/admin/login");
    }
  }

  return (
    <div className={styles["page-container"]}>
      {/* Page title */}
      <div className={styles["top-title"]}>Add New Room</div>

      {/* Form: add new room */}
      <div className={styles["form-add-new"]}>
        <div>
          <div className="d-flex justify-content-between">
            <div className={styles["input-group"]}>
              {/* Title Input */}
              <div className={`${styles["input-item"]} d-flex flex-column`}>
                <label>Title</label>
                <input type="text" placeholder="2 bed room" ref={titleRef} />
              </div>

              {/* Price Input */}
              <div className={`${styles["input-item"]} d-flex flex-column`}>
                <label>Price</label>
                <input type="number" min={1} placeholder="100" ref={priceRef} />
              </div>
            </div>

            <div className={styles["input-group"]}>
              {/* Description Input */}
              <div className={`${styles["input-item"]} d-flex flex-column`}>
                <label>Description</label>
                <input
                  type="text"
                  placeholder="King size bed, 1 bathroom"
                  ref={descRef}
                />
              </div>

              {/* Max people Input */}
              <div className={`${styles["input-item"]} d-flex flex-column`}>
                <label>Max People</label>
                <input
                  type="number"
                  min={1}
                  max={6}
                  placeholder="2"
                  ref={maxPeopleRef}
                />
              </div>
            </div>
          </div>
        </div>

        <div className={styles["row-container"]}>
          {/* Rooms Input */}
          <div className=" d-flex flex-column">
            <label>Rooms</label>
            <textarea
              className={styles["room-number"]}
              placeholder="Give comma between room numbers"
              ref={roomRef}
              onBlur={onBlurHandlerRoomInput}
            />
          </div>

          {/* Hotels Input */}
          <div
            className={`${styles["input-item"]} ${styles["list-hotel-container"]} `}
          >
            <label>Choose a hotel</label>
            <select
              className={styles["list-hotel"]}
              ref={hotelRef}
              value={selectHotel}
              onChange={onChangeListHotelHandler}
            >
              <option value={""} hidden={true}>
                Choose a hotel
              </option>
              {listHotels &&
                listHotels.map((item) => (
                  <option key={item._id} value={item._id}>
                    {item.name}
                  </option>
                ))}
            </select>
          </div>

          {/* Send Button */}
          <button
            className={styles["send-btn"]}
            onClick={onClickHandlerSendButton}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
