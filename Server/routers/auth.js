const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth");

// ======================================= PART-1: ROUTERS FOR CLIENT-APP ========================================
// Router for Check Login
router.get("/client/getActiveUserInfor", authController.getActiveUserInfor);

// Router for Login
router.post("/client/login", authController.postLogin);

// Router for Signup
router.post("/client/signup", authController.postSignup);

// Router for Logout
router.get("/client/logout", authController.getLogout);

// ======================================= PART-2: ROUTERS FOR ADMIN-APP ========================================
// Router for Check Login
router.get("/admin/getActiveUserInfor", authController.getActiveUserInfor);

// Router for Login
router.post("/admin/login", authController.postLoginAdmin);

// Router for Logout
router.get("/admin/logout", authController.getLogout);

// Export to use
module.exports = router;
