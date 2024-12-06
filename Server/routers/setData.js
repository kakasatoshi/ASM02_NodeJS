const express = require("express");
const router = express.Router();
const setDataController = require("../controllers/setData");
const { checkAuthen } = require("../middleware/CheckAuthen");

// ======================================= PART-1: ROUTERS FOR CLIENT-APP ========================================

// Router for store booking infor to "transaction" model
router.post("/client/booking", checkAuthen, setDataController.postBookingData);

// ======================================= PART-2: ROUTERS FOR ADMIN-APP ========================================

// Router for delete hotel by hotelID
router.post(
  "/admin/delete-hotel",
  checkAuthen,
  setDataController.postDeleteHotel
);

// Router for add new hotel
router.post(
  "/admin/add-new-hotel",
  checkAuthen,
  setDataController.postAddNewHotel
);

// Router for edit hotel
router.post("/admin/edit-hotel", checkAuthen, setDataController.postEditHotel);

// Router for delete room by roomID
router.post(
  "/admin/delete-room",
  checkAuthen,
  setDataController.postDeleteRoom
);

// Router for add new room
router.post(
  "/admin/add-new-room",
  checkAuthen,
  setDataController.postAddNewRoom
);

// Router for edit hotel
router.post("/admin/edit-room", checkAuthen, setDataController.postEditRoom);

// Export to use
module.exports = router;
