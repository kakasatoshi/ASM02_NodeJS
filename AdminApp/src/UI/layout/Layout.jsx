// OK
import styles from "./Layout.module.css";
import { Link, Outlet } from "react-router-dom";
import { Fragment } from "react";
import SideBar from "../sidebar/SideBar";

export default function Layout() {
  return (
    <Fragment>
      <div className={`${styles["layout-container"]} rows container-fluid`}>
        <div className={`${styles["header-part"]}`}>
          <div className={`${styles["admin"]}`}>
            <Link to={"/"}>Admin Page</Link>
          </div>
          <div className={`${styles["header"]}`} />
        </div>
        <div className={`${styles["body-part"]} d-flex align-items-stretch`}>
          <div className={`${styles["side-bar"]}`}>
            <SideBar />
          </div>
          <div className={`${styles["outlet-content"]}`}>
            <Outlet />
          </div>
        </div>
      </div>
    </Fragment>
  );
}
