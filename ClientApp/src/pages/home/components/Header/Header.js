import { Link } from "react-router-dom";
import styles from "./Header.module.css";
import SearchInput from "./SearchInput";

export default function Header(props) {
  return (
    <div
      className={`div-container background-darkBlue ${styles["header-style"]}`}
    >
      <div className={styles["title"]}>
        A lifetime of discounts? It's Genius.
      </div>
      <div className={styles["sub-title"]}>
        Get rewarded for your travels - unlock instance savings of 10% or more
        with a free account.
      </div>
      <Link to="/auth?mode=login" className={styles["btn-signin-register"]}>
        Sign in / Register
      </Link>
      <div className={styles["input-search-element"]}>
        {/* Use "SearchInput" component */}
        <SearchInput />
      </div>
    </div>
  );
}
