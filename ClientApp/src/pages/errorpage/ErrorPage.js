// OK
import Styles from "./ErrorPage.module.css";
import { useRouteError } from "react-router-dom";
import { Fragment, useEffect, useState } from "react";
import Navbar from "../home/components/Navbar/Navbar";
import { getActiveUserInfor } from "../../utils/common";
import Footer from "../home/components/Footer/Footer";

export default function ErrorPage() {
  const error = useRouteError();
  const [resData, setResData] = useState();

  // Init value for "title" and "message" variables
  let title = "AN ERROR OCCURRED!";
  let message = "Some thing went wrong";

  // Defines error information for error code "404"
  if (error.status === 404) {
    title = "NOT FOUND PAGE";
    message = "Could not found source or page";
  }

  // Defines error information for error code "500"
  if (error.status === 500) {
    message = error.data.message;
  }

  useEffect(() => {
    getActiveUserInfor()
      .then((data) => {
        setResData(data);
      })
      .catch((err) => console.log("Error Information: ", err));
  }, []);

  return (
    <Fragment>
      {/* Navbar */}
      {resData && <Navbar sessionData={resData} />}

      {/* Body */}
      <div className={Styles.content}>
        <h1>{title}</h1>
        <h3>{message}</h3>
      </div>

      {/* Footer */}
      <Footer />
    </Fragment>
  );
}
