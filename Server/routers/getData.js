const express = require("express");
const router = express.Router();
const getDataController = require("../controllers/getData");
const { checkAuthen } = require("../middleware/CheckAuthen");

// ======================================= PART-1: ROUTERS FOR CLIENT-APP ========================================
// Router for get hotel data
router.get("/client/get-hotel-data", getDataController.getHotelData);

// Router for Searching
router.post(
  "/client/search-hotel",
  checkAuthen,
  getDataController.getDataForSearching
);

// Router for Details
router.post(
  "/client/details-hotel",
  checkAuthen,
  getDataController.getHotelDetails
);

// Router for Transactions-Dashboard
router.post(
  "/client/transactions",
  checkAuthen,
  getDataController.getTransactionDataByEmail
);

// ======================================= PART-2: ROUTERS FOR ADMIN-APP ========================================
// Router for get all users
router.get("/admin/get-users", getDataController.getAllUsers);

// Router for get all hotels
router.get("/admin/get-all-hotels", getDataController.getHotelData);

// Router for get hotel by hotelID
router.post("/admin/get-hotel", getDataController.getHotelDetails);

// Router for get all rooms
router.get("/admin/get-rooms", getDataController.getAllRooms);

// Router for get room by roomID
router.post("/admin/get-room-infor", getDataController.getRoomByID);

// Router for get all transactions
router.get("/admin/get-alltransactions", getDataController.getAllTransactions);

// Export to use
module.exports = router;
