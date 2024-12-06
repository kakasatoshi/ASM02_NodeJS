import { useNavigate } from "react-router-dom";
import styles from "./Body.module.css";
import { checkLogin } from "../../../utils/common";

// Receive data from parent component (SearchList) to children component (SearchListItem) via "items" prop
export default function SearchListItem(props) {
  // Using useNavigate() hook
  const navigate = useNavigate();

  // Defines this function to get search input data then store to context
  async function seeAvailabilityHandler(hotelID) {
    const isLoggedIn = await checkLogin();
    if (isLoggedIn) navigate("/detail/" + hotelID);
  }

  // Define an "cancelMode" element
  const cancelMode = (
    <div className={styles["free-cancel"]}>
      <div> Free cancellation</div>
      <div>You can cancel later, so lock in this great price today!</div>
    </div>
  );

  // Callback funtion: to return "cancelMode" element or not
  const freeCancelMode = (mode) => {
    if (mode) return cancelMode;
  };

  // This function to format string: FORMAT THIS STRING => Format This String
  function capitalizeWords(str) {
    return str
      .toLowerCase() // convert string to lowercase tring
      .split(" ") // split word in string by white space character
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // Upcase the first character of each word
      .join(" "); // Join words to string by white space character
  }
  return (
    <div>
      {/* Render list of search result within key prop */}
      {props.listItems.map((item, index) => (
        <div className={styles["result-item"]} key={index}>
          <div>
            <img src={item.image_url} alt="hotel" />
          </div>
          <div>
            <div>
              <div className={styles["hotel-name"]}>
                {capitalizeWords(item.name)}
              </div>
              <div className={styles["distance"]}>
                {item.distance} from center
              </div>
              <span className={styles["tag-content"]}>{item.tag}</span>
              <div className={styles["description"]}>{item.description}</div>
              <div className={styles["type-hotel"]}>{item.type}</div>
              <div>{freeCancelMode(item.free_cancel)}</div>
            </div>
          </div>
          <div>
            <div className={styles["ratting-inform"]}>
              <span>{item.rate_text}</span>
              <span>{item.rate.toFixed(1)}</span>
            </div>
            <div className={styles["price-details"]}>
              <div>${item.price}</div>
              <div>Includes taxes and fees</div>

              <button
                onClick={() => {
                  seeAvailabilityHandler(item.id);
                }}
              >
                See availability
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
