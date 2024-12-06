import { useContext } from "react";
import styles from "./TypeOfHotel.module.css";
import DataContext from "../../../../context/DataContext";

// Data of type of hotel
const listTypeHotelData = [
  {
    type: "Hotel",
    image: "./images/type_1.webp",
  },
  {
    type: "Apartments",
    image: "./images/type_2.jpg",
  },
  {
    type: "Resorts",
    image: "./images/type_3.jpg",
  },
  {
    type: "Villas",
    image: "./images/type_4.jpg",
  },
  {
    type: "Cabins",
    image: "./images/type_5.jpg",
  },
];

export default function TypeOfHotel() {
  const dataCTX = useContext(DataContext);

  // This function to get number of hotel by type
  function getNumberOfHotelByType(typeOfHotel) {
    const numberOfHotel = dataCTX.hotelData.filter(
      (item) => item.type === typeOfHotel.toLowerCase()
    ).length;
    return numberOfHotel;
  }

  return (
    <div>
      <h4 className={styles["title-hotel"]}>Browse by property type</h4>
      <div className={`${styles["type-list"]} my-5`}>
        {/* Render list type of hotel within key prop */}
        {listTypeHotelData.map((item, index) => (
          <div key={index}>
            {/* image of type of hotel */}
            <img src={item.image} alt="type of hotel" />

            {/* More detail of type of hotel */}
            <p className={styles["name-type"]}>{item.type}</p>
            <p>{`${getNumberOfHotelByType(
              item.type
            )} ${item.type.toLocaleLowerCase()}`}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
