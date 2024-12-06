import styles from "./SideBar.module.css";
import { Fragment } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function SideBar() {
  const navigate = useNavigate();
  function logoutHandler() {
    const confirm = window.confirm("Do you want to realy logout?");
    if (confirm) {
      fetch("http://localhost:5000/admin/logout", {
        method: "GET",
        credentials: "include",
      })
        .then(() => {
          // Navigate to "Login" page
          navigate("/admin/login");
        })
        .catch((err) => {
          console.log("Error information: ", err);
          throw new Error(err);
        });
    }
  }
  return (
    <Fragment>
      <div className={styles["sidebar-container"]}>
        <div className={`${styles["sub-container"]} d-flex flex-column`}>
          <span className={styles["title"]}>MAIN</span>
          <div className={styles["items-list"]}>
            <img src="/images/dash-board.jpg" />
            <Link to="">Dash-Board</Link>
          </div>
        </div>

        <div className={`${styles["sub-container"]} d-flex flex-column`}>
          <span className={styles["title"]}>LISTS</span>
          <div className={styles["items-list"]}>
            <img src="/images/user.jpg" />
            <Link>Users</Link>
          </div>

          <div className={styles["items-list"]}>
            <img src="/images/hotel.jpg" />
            <Link to="hotel">Hotels</Link>
          </div>

          <div className={styles["items-list"]}>
            <img src="/images/room.jpg" />
            <Link to="room">Rooms</Link>
          </div>
          <div className={styles["items-list"]}>
            <img src="/images/transaction.jpg" />
            <Link to="transactions">Transactions</Link>
          </div>
        </div>

        <div className={`${styles["sub-container"]} d-flex flex-column`}>
          <span className={styles["title"]}>NEW</span>
          <div className={styles["items-list"]}>
            <img src="/images/hotel.jpg" />
            <Link to="hotel/new-hotel">New Hotel</Link>
          </div>

          <div className={styles["items-list"]}>
            <img src="/images/room.jpg" />
            <Link to="room/new-room">New Room</Link>
          </div>
        </div>

        <div className={`${styles["sub-container"]} d-flex flex-column`}>
          <span className={styles["title"]}>USERS</span>
          <div className={styles["items-list"]}>
            <img src="/images/logout.jpg" />
            <button className={styles["logout-btn"]} onClick={logoutHandler}>
              Logout
            </button>
          </div>
        </div>
      </div>
    </Fragment>
  );
}
