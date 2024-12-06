import { useContext } from "react";
import styles from "./TownList.module.css";
import DataContext from "../../../../context/DataContext";

// Data of town
const townListData = [
  {
    name: "Ha Noi",
    image: "./images/hanoi.jpg",
  },
  {
    name: "Ho Chi Minh",
    image: "./images/hcm.jpg",
  },
  {
    name: "Da Nang",
    image: "./images/danang.jpg",
  },
];

export default function TownList() {
  const dataCTX = useContext(DataContext);

  // This function to get number of hotel by city
  function getNumberOfHotelByCity(cityName) {
    const numberOfHotel = dataCTX.hotelData.filter(
      (item) => item.city === cityName
    ).length;
    return numberOfHotel;
  }

  return (
    <div>
      <div className={`row my-5 ${styles["town-list"]}`}>
        {/* Render list of town within key prop */}
        {townListData.map((item, index) => (
          <div key={index} className={`col-4 ${styles["div-town"]}`}>
            {/* image of towns */}
            <img src={item.image} alt="town" className={styles["img-town"]} />

            {/* Name and more information of town */}
            <p className={styles["city-name"]}>{item.name}</p>
            <p className={styles["sub-text"]}>
              {getNumberOfHotelByCity(item.name)} properties
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
