import { useContext } from "react";
import styles from "./HotelList.module.css";
import DataContext from "../../../../context/DataContext";

export default function HotelList() {
  const dataCTX = useContext(DataContext);

  // Sort hotels by top rating
  const sortTopRatingHotel = dataCTX.hotelData.sort(
    (a, b) => b.rating - a.rating
  );

  // Get first 3 hotels with hightest rating
  const topThreeHotels = sortTopRatingHotel.slice(0, 3);

  return (
    <div>
      <h4 className={`${styles["title-HotelList"]} mb-5`}>Homes guests love</h4>
      <div className="row">
        {/* Render list of hotel within key prop */}
        {topThreeHotels.map((item, index) => (
          <div key={index} className="col-4">
            {/* image of hotels */}
            <img
              src={item.photos[0]}
              alt="hotel"
              className={styles["img-hotel"]}
            />

            {/* More information of hotels */}
            <div className={styles["hotel-inform"]}>
              <a href={`/detail/${item._id}`} className={styles["link-hotel"]}>
                {item.name}
              </a>
              <p>{item.city}</p>
              <strong>Starting from ${item.cheapestPrice}</strong>
              <p className={styles["rating-hotel"]}>
                <span>
                  <strong>Rating: </strong>
                  <span className={styles["rating-mark"]}>
                    {item.rating.toFixed(1)}
                  </span>
                </span>
                <span>
                  <strong>Type: </strong>
                  <span>{item.type}</span>
                </span>
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
