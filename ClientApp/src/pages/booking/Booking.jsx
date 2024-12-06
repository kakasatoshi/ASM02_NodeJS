import styles from "./Booking.module.css";
import { useLocation } from "react-router-dom";
import BookingForm from "./BookingForm";
import { Fragment } from "react";

export default function Booking() {
  const location = useLocation();
  const hotelID = location.state?.hotelID;
  console.log("HOTEL-ID: ", hotelID);
  return (
    <Fragment>
      {!hotelID && (
        <div className={styles["instruction"]}>
          <p className={styles["title"]}>
            To book a hotel, please follow these steps:{" "}
          </p>
          <ul className={styles["content"]}>
            <li>Search hotel for booking</li>
            <li>Select a certain hotel and get details of this one</li>
            <li>Click to the "Reserve or Book Now" button to book</li>
          </ul>
        </div>
      )}
      {hotelID && <BookingForm hotelID={hotelID} />}
    </Fragment>
  );
}
