import { useLoaderData, useNavigate } from "react-router-dom";
import styles from "./NewHotel.module.css";
import { useEffect, useRef, useState } from "react";
import { checkLogin, postAddNewHotel } from "../../utils/common";

// List room type to add new to database
let newRoomIDArr = [];

export default function NewHotel() {
  const [selectFeature, setSelectFeature] = useState("");
  const [reRenderStatus, setReRenderStatus] = useState(null);
  const listRooms = useLoaderData();
  const navigate = useNavigate();

  // Define refs for input
  const nameRef = useRef();
  const cityRef = useRef();
  const distanceRef = useRef();
  const descriptionRef = useRef();
  const imageRef = useRef();
  const roomRef = useRef();
  const typeRef = useRef();
  const addressRef = useRef();
  const titleRef = useRef();
  const priceRef = useRef();
  const featureRef = useRef();

  function validateImageInput() {
    // Get value from image input and convert to array by using "split()" method
    let inputArr = imageRef.current.value.split("\n").filter((i) => i !== "");

    // Define a regex expresion to validate input:
    // (1) Image url must be begin by "http", "http" and comma "," cannot be in the middle of the image url
    // (2) Image url can be end by comma "," or not (not required)
    // (3) If the input data has multiple lines, each line must be satisfy two conditions (1) and (2).
    // http............
    // http............,
    // http............

    // Regex expression for conditions (1) & (2)
    const regex = /^(http[^\n^http^,]*,?)$/;

    // Check condition 3 (make sure each line must be satisfy both conditions (1) & (2))
    const isValid = inputArr.every((line) => regex.test(line));

    // Check input value and show error information
    if (inputArr.length > 0 && !isValid) {
      alert(
        'Input value is invalid! \nEach image link must begin with "http",\nand may be ended with comma (",") and be on a new line\n\nExample:\nhttp.........................,\nhttp.........................,\nhttp.........................,'
      );

      imageRef.current.value = "";
    }
  }

  // This function to handle event click of item of room-list
  function selectRoomItemHandler(event, index) {
    listRooms[index].isSelected = !listRooms[index].isSelected;
    if (listRooms[index].isSelected) {
      newRoomIDArr.push(listRooms[index]._id);
    } else {
      newRoomIDArr = newRoomIDArr.filter((i) => i !== listRooms[index]._id);
    }

    // set value for "roomRef" (use for validate function "validateInputForm()")
    roomRef.current.value = newRoomIDArr.length > 0 ? newRoomIDArr.length : "";

    // Update "reRenderStatus" to re-render component (update interface)
    setReRenderStatus(event);
  }

  // This function to validate input value of form
  function validateInputForm(refInput, messageText) {
    if (refInput.current.value.trim() === "") {
      alert(messageText);
      return "stop";
    }
  }

  // This function to handle onclick event of "Send" button
  async function onClickHandlerSendButton() {
    // Define an input array
    const valueInputArr = [
      { valueInput: nameRef, messageText: 'Enter value for "Name" input' },
      { valueInput: cityRef, messageText: 'Enter value for "City" input' },
      {
        valueInput: distanceRef,
        messageText: 'Enter value for "Distance" input',
      },
      {
        valueInput: descriptionRef,
        messageText: 'Enter value for "Description" input',
      },
      { valueInput: imageRef, messageText: 'Enter value for "Image" input' },
      { valueInput: typeRef, messageText: 'Enter value for "Type" input' },
      {
        valueInput: addressRef,
        messageText: 'Enter value for "Address" input',
      },
      { valueInput: titleRef, messageText: 'Enter value for "Title" input' },
      { valueInput: priceRef, messageText: 'Enter value for "Price" input' },
      {
        valueInput: featureRef,
        messageText: 'Select value for "Feature" input',
      },
      {
        valueInput: roomRef,
        messageText: 'Select value for "Rooms" input',
      },
    ];

    // Validate for "Price" input
    if (priceRef.current.value < 1) {
      alert('Value of "Price" input must be greater than or equal to 1');
      return;
    }

    // Validate for "Distance" input
    if (distanceRef.current.value < 0) {
      alert('Value of "Distance" input must be greater than or equal to 0');
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

    const hotelData = {
      address: addressRef.current.value,
      cheapestPrice: priceRef.current.value,
      city: cityRef.current.value,
      desc: descriptionRef.current.value,
      distance: distanceRef.current.value,
      featured: featureRef.current.value,
      name: nameRef.current.value,
      photos: imageRef.current.value.split(/,|\n/).filter((i) => i !== ""),
      rooms: newRoomIDArr,
      title: titleRef.current.value,
      type: typeRef.current.value,
      rating: 0,
    };

    // Add new hotel to database
    const isLoggedIn = await checkLogin();
    if (isLoggedIn) {
      await postAddNewHotel(hotelData);
      navigate("/hotel");
    } else {
      navigate("/admin/login");
    }

    // Reset array "newRoomIDArr" to empty array
    newRoomIDArr = [];
  }

  // This function to handle event onChange of select input
  function onChangeFeatureHandler(event) {
    const currentValue = event.target.value;
    setSelectFeature(currentValue);
  }

  // This useEffect() hook to reset array "newRoomIDArr" to empty array when re-render this page
  useEffect(() => {
    newRoomIDArr = [];
  }, []);

  return (
    <div className={styles["page-container"]}>
      {/* Page Title */}
      <div className={styles["top-title"]}>Add New Hotel</div>

      {/* Form: Add new Hotel */}
      <div className={styles["form-add-new"]}>
        <div>
          <div className="d-flex justify-content-between">
            <div className={styles["input-group"]}>
              {/* Name Input */}
              <div className={`${styles["input-item"]} d-flex flex-column`}>
                <label>Name</label>
                <input type="text" placeholder="My Hotel" ref={nameRef} />
              </div>

              {/* City Input */}
              <div className={`${styles["input-item"]} d-flex flex-column`}>
                <label>City</label>
                <input type="text" placeholder="New York" ref={cityRef} />
              </div>

              {/* Distance Input */}
              <div className={`${styles["input-item"]} d-flex flex-column`}>
                <label>Distance from city center</label>
                <input
                  type="number"
                  placeholder="500"
                  min={0}
                  ref={distanceRef}
                />
              </div>

              {/* Description Input */}
              <div className={`${styles["input-item"]} d-flex flex-column`}>
                <label>Description</label>
                <input
                  type="text"
                  placeholder="Description"
                  ref={descriptionRef}
                />
              </div>

              {/* Image Input */}
              <div className={`${styles["input-item"]} d-flex flex-column`}>
                <label>Image</label>
                <textarea
                  className={styles["image-input"]}
                  ref={imageRef}
                  onBlur={validateImageInput}
                  placeholder=""
                />
              </div>
            </div>

            <div className={styles["input-group"]}>
              {/* Type of Hotel Input */}
              <div className={`${styles["input-item"]} d-flex flex-column`}>
                <label>Type</label>
                <input type="text" placeholder="hotel" ref={typeRef} />
              </div>

              {/* Address Input */}
              <div className={`${styles["input-item"]} d-flex flex-column`}>
                <label>Address</label>
                <input
                  type="text"
                  placeholder="Elton st, 216"
                  ref={addressRef}
                />
              </div>

              {/* Title Input */}
              <div className={`${styles["input-item"]} d-flex flex-column`}>
                <label>Title</label>
                <input
                  type="text"
                  placeholder="The best hotel"
                  ref={titleRef}
                />
              </div>

              {/* Price Input */}
              <div className={`${styles["input-item"]} d-flex flex-column`}>
                <label>Price</label>
                <input type="number" placeholder="100" ref={priceRef} min={1} />
              </div>

              {/* Feature Input */}
              <div className={`${styles["input-item"]} d-flex flex-column`}>
                <label>Featured</label>
                <select
                  className={styles["feature"]}
                  ref={featureRef}
                  value={selectFeature}
                  onChange={onChangeFeatureHandler}
                >
                  <option value={""} hidden={true}></option>
                  <option value={false}>No</option>
                  <option value={true}>Yes</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Rooms Input */}
        <div>
          <input type="hidden" ref={roomRef} />
          <label>Rooms</label>
          <ul className={styles["list-rooms"]}>
            {listRooms.map((item, index) => (
              <li
                key={index}
                className={styles[item.isSelected ? "selected-item" : null]}
                onClick={(event) => selectRoomItemHandler(event, index)}
              >
                {item.title}
              </li>
            ))}
          </ul>
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
  );
}
