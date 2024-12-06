import { useEffect, useState } from "react";
import { getHotelDetails } from "../../../utils/common";
import styles from "./Body.module.css";
import { Link, useParams } from "react-router-dom";

export default function Body() {
  // Use some hooks
  const [hotelDetails, setHotelDetails] = useState(null);
  const urlParams = useParams();
  const hotelID = urlParams.hotelID;

  // Data of details
  let detailData;
  if (hotelDetails) {
    detailData = {
      id: hotelDetails._id,
      name: hotelDetails.name,
      address: hotelDetails.address,
      distance: `Excellent location - ${hotelDetails.distance}m from center`,
      price: `Book a stay over $${hotelDetails.cheapestPrice} at this property and get a free airport taxi`,
      photos: hotelDetails.photos,
      title: hotelDetails.title,
      description: hotelDetails.desc,
      nine_night_price: hotelDetails.cheapestPrice,
    };
  }

  useEffect(() => {
    // Get detail information of hotel from data base to show on "Details" page at first time load page
    getHotelDetails(hotelID)
      .then((data) => {
        setHotelDetails(data);
      })
      .catch((err) => console.log("Error Information: ", err));
  }, []);

  const reveserBookButton = (
    <Link
      to="/booking"
      state={{ hotelID }}
      className={styles["booking-button"]}
    >
      Reserve or Book Now!
    </Link>
  );

  return (
    <div>
      {hotelDetails && (
        <div>
          {/* Part1: Top content of detail page */}
          <div className={styles["top-content"]}>
            <div className={styles["inform"]}>
              <div className={styles["name"]}>{detailData["name"]}</div>
              <div className={styles["address"]}>
                <i className="fa fa-map-marker" aria-hidden="true"></i>
                <div>{detailData["address"]}</div>
              </div>
              <div className={styles["distance"]}>{detailData["distance"]}</div>
              <div className={styles["price"]}>{detailData["price"]}</div>
            </div>
            <div>{reveserBookButton}</div>
          </div>

          {/* Part2: List of photos on detail page */}
          <div className={styles["image-list"]}>
            {/* Render list of photos in detail page within key prop */}
            {detailData["photos"].map((item, index) => (
              <img src={item} key={index} alt={item} />
            ))}
          </div>

          {/* Part3: More information on detail page */}
          <div className={styles["more-detail-inform"]}>
            <div>
              <div className={styles["title"]}>{detailData["title"]}</div>
              <p className={styles["description"]}>
                {detailData["description"]}
              </p>
            </div>
            <div className={styles["frame-price-detail"]}>
              <p className={styles["nine-night-price"]}>
                ${detailData["nine_night_price"]} <span>(1 nights)</span>
              </p>
              {reveserBookButton}
            </div>
          </div>
        </div>
      )}

      {!hotelDetails && (
        <p className={styles["alt-text-details"]}>Details of Hotel</p>
      )}
    </div>
  );
}
