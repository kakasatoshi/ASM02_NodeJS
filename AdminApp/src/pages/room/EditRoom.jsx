import styles from "./EditRoom.module.css";
import { Form, Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { checkLogin, getRoomByID, postEditRoom } from "../../utils/common";

export default function EditRoom() {
  const location = useLocation();
  const [isChangeForm, setIsChangeForm] = useState(false);
  const roomID = location.state?.roomID;
  const navigate = useNavigate();

  // Define refs for input
  const maxPeopleRef = useRef();
  const descRef = useRef();
  const roomRef = useRef();
  const titleRef = useRef();
  const priceRef = useRef();

  // This function to handle onBlur event of "Room" input
  function onBlurHandlerRoomInput() {
    // Get value of room input by "roomRef"
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

  // This function to handle onclick event of "Send" button
  async function onClickHandlerSaveButton() {
    // Define an input array
    const valueInputArr = [
      {
        valueInput: maxPeopleRef,
        messageText: 'Enter value for "Distance" input',
      },
      {
        valueInput: descRef,
        messageText: 'Enter value for "Description" input',
      },
      { valueInput: titleRef, messageText: 'Enter value for "Title" input' },
      { valueInput: priceRef, messageText: 'Enter value for "Price" input' },
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

    const roomData = {
      _id: roomID,
      price: priceRef.current.value,
      desc: descRef.current.value,
      maxPeople: maxPeopleRef.current.value,
      roomNumbers: roomRef.current.value.replace(/\s+/g, "").split(","),
      title: titleRef.current.value,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Add new hotel to database
    const isLoggedIn = await checkLogin();
    if (isLoggedIn) {
      await postEditRoom(roomData);
      navigate("/room");
    } else {
      navigate("/admin/login");
    }
  }

  // This useEffect() hook to get information of room to edit
  useEffect(() => {
    // Get information of room
    if (roomID) {
      getRoomByID(roomID).then((room) => {
        maxPeopleRef.current.value = room.maxPeople;
        descRef.current.value = room.desc;
        titleRef.current.value = room.title;
        priceRef.current.value = room.price;
        roomRef.current.value = room.roomNumbers;
      });
    }
  }, []);

  function onSubmitHandler(event) {
    event.preventDefault();
  }

  function onChangeFormHandler() {
    setIsChangeForm(true);
  }

  return (
    <div className={styles["page-container"]}>
      <div className={styles["top-title"]}>Edit Room</div>
      {/* Instructions for accessing the edit-hotel page */}
      {!roomID && (
        <div className={styles["instruction"]}>
          <p className={styles["title"]}>
            To edit a room, please follow these steps:{" "}
          </p>
          <ul className={styles["content"]}>
            <li>Access the "Rooms" page</li>
            <li>
              Select a certain room and click to the "Edit" button of this one
            </li>
            <li>
              Fill up the edit form then click to the "Save" button to finish
            </li>
          </ul>
        </div>
      )}

      {/* Edit Form */}
      {roomID && (
        <Form onSubmit={onSubmitHandler} onChange={onChangeFormHandler}>
          <div className={styles["form-add-new"]}>
            <div>
              <div className="d-flex justify-content-between">
                <div className={styles["input-group"]}>
                  <div className={`${styles["input-item"]} d-flex flex-column`}>
                    <label>Title</label>
                    <input
                      type="text"
                      placeholder="The best hotel"
                      ref={titleRef}
                    />
                  </div>
                  <div className={`${styles["input-item"]} d-flex flex-column`}>
                    <label>Price</label>
                    <input
                      type="number"
                      placeholder="100"
                      ref={priceRef}
                      min={1}
                    />
                  </div>
                </div>

                <div className={styles["input-group"]}>
                  <div className={`${styles["input-item"]} d-flex flex-column`}>
                    <label>Max People</label>
                    <input
                      type="number"
                      placeholder="500"
                      min={1}
                      max={6}
                      ref={maxPeopleRef}
                    />
                  </div>
                  <div className={`${styles["input-item"]} d-flex flex-column`}>
                    <label>Description</label>
                    <input
                      type="text"
                      placeholder="Description"
                      ref={descRef}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div>
              <input type="hidden" ref={roomRef} />
              <div className=" d-flex flex-column">
                <label>Rooms</label>
                <textarea
                  className={styles["room-number"]}
                  placeholder="Give comma between room numbers: 101, 102, 103"
                  ref={roomRef}
                  onBlur={onBlurHandlerRoomInput}
                />
              </div>
            </div>

            {/* Save And Cancel Button */}
            <div className={styles["button-control"]}>
              {isChangeForm && (
                <button
                  className={`${styles["send-btn"]} ${styles["active"]}`}
                  onClick={onClickHandlerSaveButton}
                >
                  Save
                </button>
              )}

              {!isChangeForm && (
                <span
                  className={`${styles["send-btn"]} ${
                    styles[!isChangeForm ? "disable" : null]
                  }`}
                >
                  Save
                </span>
              )}

              <Link className={styles["cancel-btn"]} to={"/room"}>
                Cancel
              </Link>
            </div>
          </div>
        </Form>
      )}
    </div>
  );
}
