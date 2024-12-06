const bcrypt = require("bcryptjs");
const User = require("../models/user");

// ====================================== PART-1: ACTIONS FOR CLIENT-APP =======================================
exports.getActiveUserInfor = async (req, res, next) => {
  const session = req.session;
  return res.json({ session });
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  // Get user data by email
  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        return res.json({
          message: "User is not exist, recheck your email please!",
          isAuthError: true,
        });
      }

      // Check if entered password is exactly by "bcrypt.compare()" method
      bcrypt
        .compare(password, user.password)
        .then((doMatch) => {
          if (!doMatch) {
            // Password is not exactly:
            return res.json({
              message: "Email or Password is not exactly!",
              isAuthError: true,
            });
          } else {
            // Password is exactly: assign true value to "isLoggedIn" property and user data to "user" property in the session
            req.session.isLoggedIn = true;
            req.session.user = user;
            try {
              req.session.save();
            } catch (error) {
              console.log("Creating session-cookie is failed", err);
            }

            return res.json({
              message: "Successful",
              isAuthError: false,
            });
          }
        })
        .catch((err) => {
          console.log("Error information: ", err);
        });
    })
    .catch((err) => console.log("Error information: ", err));
};

exports.postSignup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  // Get email by entered email from "user" model in database
  User.findOne({ email: email })
    .then((userDoc) => {
      if (userDoc) {
        return res.json({
          message: "Email exists already, use an other email please!",
          isAuthError: true,
        });
      }

      // Encrypt the password to hash code by bcrypt
      return bcrypt
        .hash(password, 12)
        .then((hashedPassword) => {
          const user = new User({
            email: email,
            password: hashedPassword,
          });
          return user.save();
        })
        .then((result) => {
          console.log("Signup successful!");
          return res.json({ message: "Successful", isAuthError: false });
        });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: err });
    });
};

// exports.postLogout = (req, res, next) => {
exports.getLogout = (req, res, next) => {
  // - Khi user click vào logout thì session lưu trên MongoDB (xem trong MongoDB compass) sẽ bị xoá,
  // nhưng cookie lưu trên trình duyệt(xem trong tab Application) sẽ không bị xoá
  // - Khi user click vào login trở lại thì session mới sẽ được tạo ra và lưu trên database và một cookie mới
  //  cũng được tạo ra lưu trên trình duyệt và ghi đè vào cookie cũ

  // Delete session in server and redirect to home page
  req.session.destroy((err) => {
    console.log("Error information for logout: ", err);
  });
  console.log("====== Delete session already ======");
  res.json({ message: "Logging out is successful" });
};

// ====================================== PART-2: ACTIONS FOR ADMIN-APP ======================================
exports.postLoginAdmin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  // Get user data by email
  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        return res.json({
          message: "User is not exist, recheck your email please!",
          isAuthError: true,
        });
      }

      // Check if entered password is exactly by "bcrypt.compare()" method
      bcrypt
        .compare(password, user.password)
        .then((doMatch) => {
          if (!doMatch) {
            // Password is not exactly:
            return res.json({
              message: "Email or Password is not exactly!",
              isAuthError: true,
            });
          }

          if (!user.isAdmin) {
            // User is not admin:
            return res.json({
              message: "You have not permission to access admin page!",
              isAuthError: true,
            });
          }

          // User is exist, Password is exactly, user is admin: assign true value to "isLoggedIn" property and user data to "user" property in the session
          req.session.isLoggedIn = true;
          req.session.user = user;
          try {
            req.session.save();
          } catch (error) {
            console.log("Creating session-cookie is failed", err);
          }

          return res.json({
            message: "Successful",
            isAuthError: false,
          });
        })
        .catch((err) => {
          console.log("Error information: ", err);
        });
    })
    .catch((err) => console.log("Error information: ", err));
};
