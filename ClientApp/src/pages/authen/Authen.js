import Styles from "./Authen.module.css";
import {
  Form,
  useActionData,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { useEffect, useRef, useState } from "react";

const Authen = () => {
  const [urlSearchParam] = useSearchParams();
  const authMode = urlSearchParam.get("mode") ?? "login";
  const authTitle = authMode === "login" ? "Login" : "Sign Up";
  const textButton = authMode === "login" ? "Login" : "Create Account ";
  const navigate = useNavigate();
  const refAuthForm = useRef();
  const resData = useActionData();
  const message = resData?.message;
  const [textError, setTextError] = useState(message);
  const [isAuthError, setIsAuthError] = useState(resData?.isAuthError);

  function onChangeForm() {
    if (isAuthError) {
      setTextError(null);
      setIsAuthError(false);
    }
  }

  // This Effect() hook to reset authentication form when change between login and signup mode
  useEffect(() => {
    refAuthForm.current.email.value = "";
    refAuthForm.current.password.value = "";
    setIsAuthError(false);
    setTextError(null);
  }, [authMode]);

  // This Effect() hook base on status of authentication (successful/failed) to redirect to appropriate page (Home/Login)
  useEffect(() => {
    // Display error message for authentication
    if (resData?.isAuthError) {
      setIsAuthError(true);
      setTextError(message);
    }

    // Navigate to "login" or "home" page when authentication is success
    if (authMode === "signup" && message === "Successful") {
      alert("Signup is successful!");
      navigate("/auth?mode=login");
    } else if (authMode === "login" && message === "Successful") {
      navigate("/");
    }
  }, [resData]);

  return (
    <div>
      {/* Display Error message for Login/Signup */}
      <div
        className={`${Styles["error-container"]} ${
          Styles[isAuthError ? "auth-error-infor" : ""]
        }`}
      >
        {isAuthError && textError}
      </div>

      {/* Authentication Form */}
      <Form
        className={Styles.authForm}
        method="POST"
        ref={refAuthForm}
        onChange={onChangeForm}
      >
        <p className={Styles.authTitle}>{authTitle}</p>
        <input type="text" name="email" placeholder="Enter email" required />
        <input
          type="password"
          name="password"
          placeholder="Enter password"
          required
        />

        {/* Submit button: Login/Create Account */}
        <button>{textButton}</button>
        <input type="hidden" name="authMode" value={authMode} />
      </Form>
    </div>
  );
};

export default Authen;
