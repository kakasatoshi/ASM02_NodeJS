import Styles from "./Login.module.css";
import { Form, useActionData, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

const Login = () => {
  const navigate = useNavigate();
  const refAuthForm = useRef();
  const resData = useActionData();
  const message = resData?.message;
  const [textError, setTextError] = useState(message);
  const [isAuthError, setIsAuthError] = useState(resData?.isAuthError);

  // This function to handle onChange event of form
  function onChangeForm() {
    if (isAuthError) {
      setTextError(null);
      setIsAuthError(false);
    }
  }

  // This Effect() hook base on status of authentication (successful/failed) to redirect to appropriate page (Home/Login)
  useEffect(() => {
    // Display error message for authentication
    if (resData?.isAuthError) {
      setIsAuthError(true);
      setTextError(message);
    }

    // Navigate to "login" or "home" page when authentication is success
    if (message === "Successful") {
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

      {/* Login Form */}
      <Form
        className={Styles.authForm}
        method="POST"
        ref={refAuthForm}
        onChange={onChangeForm}
      >
        <p className={Styles["login-title"]}>Login</p>
        <input type="text" name="email" placeholder="Enter email" required />
        <input
          type="password"
          name="password"
          placeholder="Enter password"
          required
        />

        {/* Submit button: Login/Create Account */}
        <button>Login</button>
      </Form>
    </div>
  );
};

export default Login;
