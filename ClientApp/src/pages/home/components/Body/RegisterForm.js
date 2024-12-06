import classes from "./RegisterForm.module.css";

export default function RegisterForm() {
  return (
    <div className="div-container background-darkBlue mt-5">
      <div className={classes["register-form"]}>
        {/* Title of register form */}
        <div className={classes["title-register"]}>Save time, save money!</div>
        <div className={classes["subtitle-register"]}>
          Sign up and we'll send the best deals to you
        </div>

        {/* Input and submit button of register form */}
        <div className={classes["register-frame"]}>
          <input type="text" placeholder="Your Email" />
          <button>Subscribe</button>
        </div>
      </div>
    </div>
  );
}
