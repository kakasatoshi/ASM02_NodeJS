import styles from "./EditHotel.module.css";
import {
  Form,
  Link,
  useLoaderData,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { checkLogin, getHotelByID, postEditHotel } from "../../utils/common";

export default function EditHotel() {
  const location = useLocation();
  const [isChangeForm, setIsChangeForm] = useState(false);
  const hotelID = location.state?.hotelID;
  const [hotelData, setHotelData] = useState(null);
  const [selectFeature, setSelectFeature] = useState("");
  const [newRoomIDArr, setNewRoomIDArr] = useState([]);
  const [listRooms, setListRooms] = useState(useLoaderData());
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
  const rateRef = useRef();

  // This function to handle event click of item of room-list
  function selectRoomItemHandler(index) {
    // Set value of "isChangeForm" status to true
    setIsChangeForm(true);

    const updatedRooms = listRooms.map((room, i) =>
      i === index ? { ...room, isSelected: !room.isSelected } : room
    );
    setListRooms(updatedRooms);
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
    // Get value for imageRef
    const listImage = [];
    const listImageEL = document.getElementById("listImage");
    listImageEL.querySelectorAll("input").forEach((input) => {
      if (input.value !== "") listImage.push(input.value);
    });

    // set value for "imageRef" (use for validate function "validateInputForm()")
    imageRef.current.value = listImage.length > 0 ? listImage : "";

    // set value for "roomRef" (use for validate function "validateInputForm()")
    roomRef.current.value = newRoomIDArr.length > 0 ? newRoomIDArr : "";

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
      {
        valueInput: rateRef,
        messageText: 'Select value for "Rate" input',
      },
    ];

    // Validate for "Price" input
    if (priceRef.current.value < 1) {
      alert('Value of "Price" input must be greater than 0');
      return;
    }

    // Validate for "Distance" input
    if (distanceRef.current.value < 0) {
      alert('Value of "Distance" input must be greater than or equal to 0');
      return;
    }

    // Validate for "Rate" input
    if (rateRef.current.value < 0 || rateRef.current.value > 10) {
      alert(
        'Value of "Rate" input must be greater than or equal to 0\nand less than or equal to 10'
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

    const hotelData = {
      _id: hotelID,
      address: addressRef.current.value,
      cheapestPrice: priceRef.current.value,
      city: cityRef.current.value,
      desc: descriptionRef.current.value,
      distance: distanceRef.current.value,
      featured: featureRef.current.value,
      name: nameRef.current.value,
      photos: listImage,
      rooms: newRoomIDArr,
      title: titleRef.current.value,
      type: typeRef.current.value,
      rating: rateRef.current.value,
    };

    // Add new hotel to database
    const isLoggedIn = await checkLogin();
    if (isLoggedIn) {
      await postEditHotel(hotelData);
      navigate("/hotel");
    } else {
      navigate("/admin/login");
    }
  }

  // This function to handle event onChange of select input
  function onChangeFeatureHandler(event) {
    const currentValue = event.target.value;
    setSelectFeature(currentValue);
  }

  // This useEffect() hook to reset array "newRoomIDArr" to empty array when re-render this page
  useEffect(() => {
    // Get information of hotel
    if (hotelID) {
      getHotelByID(hotelID).then((hotel) => {
        // Show information of current hotel in all input of edit-form
        nameRef.current.value = hotel.name;
        cityRef.current.value = hotel.city;
        distanceRef.current.value = hotel.distance;
        descriptionRef.current.value = hotel.desc;
        typeRef.current.value = hotel.type;
        addressRef.current.value = hotel.address;
        titleRef.current.value = hotel.title;
        priceRef.current.value = hotel.cheapestPrice;
        rateRef.current.value = hotel.rating;
        setSelectFeature(hotel.featured);

        // Hight light all room of current hotel in room list
        const newListRoom = listRooms.map((room) => {
          return {
            ...room,
            isSelected: hotel.rooms.map((i) => i._id).includes(room._id)
              ? true
              : false,
          };
        });
        setListRooms(newListRoom);
        setHotelData(hotel);
      });
    }
  }, []);

  useEffect(() => {
    const selectedRooms = listRooms
      .filter((room) => room.isSelected)
      .map((room) => room._id);
    setNewRoomIDArr(selectedRooms);
  }, [listRooms]);

  function onSubmitHandler(event) {
    event.preventDefault();
  }

  function onChangeFormHandler() {
    setIsChangeForm(true);
  }

  return (
    <div className={styles["page-container"]}>
      <div className={styles["top-title"]}>Edit Hotel</div>

      {/* Instructions for accessing the edit-hotel page */}
      {!hotelID && (
        <div className={styles["instruction"]}>
          <p className={styles["title"]}>
            To edit a hotel, please follow these steps:{" "}
          </p>
          <ul className={styles["content"]}>
            <li>Access the "Hotels" page</li>
            <li>
              Select a certain hotel and click to the "Edit" button of this one
            </li>
            <li>
              Fill up the edit form then click to the "Save" button to finish
            </li>
          </ul>
        </div>
      )}

      {/* Edit Form */}
      {hotelID && (
        <Form onSubmit={onSubmitHandler} onChange={onChangeFormHandler}>
          <div className={styles["form-add-new"]}>
            <div>
              <div className="d-flex justify-content-between">
                <div className={styles["input-group"]}>
                  <div className={`${styles["input-item"]} d-flex flex-column`}>
                    <label>Name</label>
                    <input type="text" placeholder="My Hotel" ref={nameRef} />
                  </div>
                  <div className={`${styles["input-item"]} d-flex flex-column`}>
                    <label>City</label>
                    <input type="text" placeholder="New York" ref={cityRef} />
                  </div>
                  <div className={`${styles["input-item"]} d-flex flex-column`}>
                    <label>Distance from city center</label>
                    <input
                      type="number"
                      placeholder="500"
                      min={0}
                      ref={distanceRef}
                    />
                  </div>
                  <div className={`${styles["input-item"]} d-flex flex-column`}>
                    <label>Description</label>
                    <input
                      type="text"
                      placeholder="Description"
                      ref={descriptionRef}
                    />
                  </div>
                  <div className={`${styles["input-item"]} d-flex flex-column`}>
                    <label>Image</label>
                    <input type="hidden" ref={imageRef} />
                    <div id="listImage" className={styles["image-input"]}>
                      {hotelData &&
                        hotelData.photos.map((i, index) => (
                          <input key={index} type="text" defaultValue={i} />
                        ))}
                    </div>
                  </div>
                </div>

                <div className={styles["input-group"]}>
                  <div className={`${styles["input-item"]} d-flex flex-column`}>
                    <label>Type</label>
                    <input type="text" placeholder="hotel" ref={typeRef} />
                  </div>
                  <div className={`${styles["input-item"]} d-flex flex-column`}>
                    <label>Address</label>
                    <input
                      type="text"
                      placeholder="Elton st, 216"
                      ref={addressRef}
                    />
                  </div>
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
                  <div className={`${styles["input-item"]} d-flex flex-column`}>
                    <label>Rate</label>
                    <input
                      type="number"
                      placeholder="5"
                      ref={rateRef}
                      min={0}
                      max={10}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div>
              <input type="hidden" ref={roomRef} />
              <label>Rooms</label>
              <ul className={styles["list-rooms"]}>
                {hotelData &&
                  listRooms.map((item, index) => (
                    <li
                      key={index}
                      className={
                        styles[item.isSelected ? "selected-item" : null]
                      }
                      onClick={() => selectRoomItemHandler(index)}
                    >
                      {item.title}
                    </li>
                  ))}
              </ul>
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

              <Link className={styles["cancel-btn"]} to={"/hotel"}>
                Cancel
              </Link>
            </div>
          </div>
        </Form>
      )}
    </div>
  );
}
