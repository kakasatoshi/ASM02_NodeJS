// OK
import { Fragment } from "react";
import Styles from "./ErrorPage.module.css";
import { useRouteError } from "react-router-dom";

export default function ErrorPage() {
  const error = useRouteError();

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

  return (
    <Fragment>
      <div className={Styles.content}>
        <h1>{title}</h1>
        <h3>{message}</h3>
      </div>
    </Fragment>
  );
}
