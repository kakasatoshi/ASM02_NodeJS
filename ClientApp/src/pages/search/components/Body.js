import styles from "./Body.module.css";
import { useContext, useEffect, useState } from "react";
import SearchList from "./SearchList";
import SearchPopup from "./SearchPopup";
import DataContext from "../../../context/DataContext";
import { getHotelDataForSearching } from "../../../utils/common";

export default function Body() {
  // Get search params from context to search hotels
  const dataCTX = useContext(DataContext);
  const city = dataCTX.searchParams.city;
  const dateStart = dataCTX.searchParams.dateStart;
  const dateEnd = dataCTX.searchParams.dateEnd;
  const totalPeople = dataCTX.searchParams.totalPeople;
  const roomQuantity = dataCTX.searchParams.roomQuantity;
  const [listHotel, setListHotel] = useState(null);

  let searchListData;
  if (listHotel) {
    searchListData = listHotel.map((item) => {
      return {
        id: item._id,
        name: item.name,
        distance: item.distance + "m",
        tag: "Free airport taxi",
        type: item.type,
        description: item.desc,
        free_cancel: item.featured,
        price: item.cheapestPrice,
        rate: item.rating,
        rate_text: "Excellent",
        image_url: item.photos[0],
      };
    });
  }

  useEffect(() => {
    // Get list of hotel by search params
    getHotelDataForSearching(
      city,
      dateStart,
      dateEnd,
      totalPeople,
      roomQuantity
    )
      .then((data) => {
        setListHotel(data?.availableHotels);
      })
      .catch((err) => console.log("Error Information: ", err));
  }, []);

  // This function to get data hotel from children component "SearchPopup"
  function getHotelDataList(hotelData) {
    setListHotel(hotelData?.availableHotels);
  }

  return (
    <div className="row">
      <div className="col-3">
        <SearchPopup sendHotelData={getHotelDataList} />
      </div>
      <div className="col-9">
        {!listHotel && (
          <p className={styles["search-result"]}>Search result is here!</p>
        )}

        {listHotel && <SearchList searchResult={searchListData} />}

        {listHotel?.length === 0 && (
          <p className={`${styles["search-result"]} ${styles["not-found"]}`}>
            Not found search results!
          </p>
        )}
      </div>
    </div>
  );
}
