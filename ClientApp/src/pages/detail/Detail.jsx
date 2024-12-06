import styles from "./Detail.module.css";
import Body from "./components/Body";

const Detail = () => {
  return (
    <div>
      <div className={styles["div-container"]}>
        <Body />
      </div>
    </div>
  );
};

export default Detail;
