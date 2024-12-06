import NavbarItem from "./NavbarItem";
import styles from "./Navbar.module.css";
import { Link } from "react-router-dom";

// Data of navbar-item:
const navBarItemData = [
  {
    type: "Stays",
    icon: "fa-bed",
    active: true,
  },
  {
    type: "Flights",
    icon: "fa-plane",
    active: false,
  },
  {
    type: "Car rentals",
    icon: "fa-car",
    active: false,
  },
  {
    type: "Attractions",
    icon: "fa-bed",
    active: false,
  },
  {
    type: "Airport taxis",
    icon: "fa-taxi",
    active: false,
  },
];

export default function Navbar({ sessionData }) {
  const pathURL = window.location.pathname;
  const authMode = window.location.search;
  const isLoggedIn = sessionData.session.isLoggedIn;
  const userEmail = sessionData.session.user?.email;

  function logoutHandler() {
    const confirm = window.confirm("Do you want to realy logout?");
    if (confirm) {
      fetch("http://localhost:5000/client/logout", {
        method: "GET",
        credentials: "include",
      })
        .then(() => {
          // Clear all data in local storage
          localStorage.clear();

          // Redirect to "Home" page
          window.location.href = "/";
        })
        .catch((err) => {
          console.log("Error information: ", err);
          throw new Error(err);
        });
    }
  }

  // Defines "Signup Button" element
  const signupButtonEL = (
    <div>
      {(authMode === "" || authMode !== "?mode=signup") && (
        <Link className={styles["btn-register-login"]} to={"/auth?mode=signup"}>
          Sign Up
        </Link>
      )}
    </div>
  );

  // Defines "Login Button" element
  const loginButtonEL = (
    <div>
      {(authMode === "" || authMode === "?mode=signup") && (
        <Link className={styles["btn-register-login"]} to={"/auth?mode=login"}>
          Login
        </Link>
      )}
    </div>
  );

  return (
    <div
      className={`div-container background-darkBlue ${styles["navbar-style"]}`}
    >
      {/* Register/Login button */}
      <div className={styles["top-content"]}>
        <Link className={styles["home-title"]} to="/">
          Booking
        </Link>

        {/* User has not logged in: show Register and Login button*/}
        {!isLoggedIn && (
          <div className="d-flex">
            {signupButtonEL}
            {loginButtonEL}
          </div>
        )}

        {/* User has logged in already: show email and Transaction/Logout button*/}
        {isLoggedIn && (
          <div>
            <label className={styles["user-email"]}>{userEmail}</label>
            <Link className={styles["btn-register-login"]} to={"/transactions"}>
              Transactions
            </Link>

            <button
              className={styles["btn-register-login"]}
              onClick={logoutHandler}
            >
              Log out
            </button>
          </div>
        )}
      </div>

      {/* Navbar Content */}
      {pathURL !== "/auth" && (
        <div className={`${styles["navbar-content"]} navbar d-flex`}>
          {/* Render list navbar-item within key prop */}
          {navBarItemData.map((item, index) => (
            // Pass data from parent component (Navbar) to children component (NavbarItem) via "item" prop
            <NavbarItem item={item} key={index} />
          ))}
        </div>
      )}
    </div>
  );
}
