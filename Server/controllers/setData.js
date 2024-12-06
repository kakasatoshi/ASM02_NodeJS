const Transaction = require("../models/transaction");
const Hotel = require("../models/hotel");
const Room = require("../models/room");

// Action for booking
exports.postBookingData = (req, res, next) => {
  const transaction = new Transaction(req.body.bookingInfor);
  transaction.save();
  res.status(200).json({ message: "Transaction is successful!" });
};

// Action for delete hotel by hotelID
exports.postDeleteHotel = (req, res, next) => {
  const hotelID = req.body.hotelID;

  // Check if hotel is in transaction
  Transaction.find({ hotel: hotelID })
    .then((data) => {
      if (data.length > 0) {
        // Hotel is booked, so deny delete action and send message to client
        res.json({ message: "Hotel is booked" });
      } else {
        // Hotel is not booked, so delete hotel
        Hotel.findByIdAndDelete(hotelID).then((result) =>
          res.json({ message: "Delete hotel is successful!" })
        );
      }
    })
    .catch((err) => console.log("Error in delete hotel by hotelID: ", err));
};

// Action for add new hotel
exports.postAddNewHotel = (req, res, next) => {
  const hotelData = req.body.hotelData;
  const hotel = new Hotel(hotelData);
  hotel
    .save()
    .then((result) => {
      // ====================================================================
      console.log("===== Add new hotel data is successful! =====");
      // ====================================================================
      res.status(200).json({ message: "Add new hotel process is successful!" });
    })
    .catch((err) => {
      console.log("Error in add new hotel: ", err);
      res.json({ message: err });
    });
};

// Action for edit hotel
exports.postEditHotel = async (req, res, next) => {
  const hotelData = req.body.hotelData;
  const hotelID = hotelData._id;

  const newHotelData = await Hotel.findByIdAndUpdate(
    hotelID,
    { $set: hotelData },
    { new: true, runValidators: true }
  );

  // ==============================================================
  console.log("Edit hotel process is successful!");
  console.log("====== New Hotel =======: ", newHotelData);
  // ==============================================================

  res.status(200).json({ message: "Edit hotel process is successful!" });
};

// Action for delete room by roomID
exports.postDeleteRoom = (req, res, next) => {
  const roomID = req.body.roomID;

  // Check if room is in transaction
  Transaction.find({ "rooms.roomID": roomID })
    .then((data) => {
      if (data.length > 0) {
        // Room is booked, so deny delete action and send message to client
        res.json({ message: "Room is booked" });
      } else {
        // Room is not booked, so delete room in "rooms" model
        Room.findByIdAndDelete(roomID).then(async (result) => {
          // Find all hotel which have "rooms" property includes "id" of deleted room
          // Tìm tất cả các tài liệu trong collection "hotels" mà thuộc tính "rooms" chứa giá trị "myID"
          const hotels = await Hotel.find({ rooms: roomID });

          // Lặp qua từng tài liệu và xoá phần tử bằng với "roomID" khỏi thuộc tính "rooms"
          for (const hotel of hotels) {
            // Loại bỏ phần tử bằng "roomID" khỏi mảng "rooms" của hotel
            hotel.rooms = hotel.rooms.filter(
              (roomId) => !roomId.equals(roomID)
            );

            // Cập nhật lại tài liệu sau khi đã xoá "myID"
            await hotel.save();
          }

          res.json({ message: "Delete room is successful!" });
        });
      }
    })
    .catch((err) => console.log("Error in delete room by roomID: ", err));
};

// Action for add new room
exports.postAddNewRoom = (req, res, next) => {
  const hotelID = req.body.requestData.hotelID;
  const roomData = req.body.requestData.roomData;
  const room = new Room(roomData);

  // Save new room to "rooms" model in database
  room
    .save()
    .then(async (result) => {
      // ====================================================================
      console.log("===== Add new room data is successful! =====");
      // ====================================================================

      // Get id of new item in "rooms" model (new room has just been created)
      const newRoom = await Room.findOne()
        .sort({ createdAt: -1 })
        .select("_id");
      const newRoomID = newRoom ? newRoom._id : null;

      // ==================================================
      console.log("=== Model Room Data ===: ", newRoomID);
      // ==================================================

      // Add new room to hotel which is selected
      const selectedHotel = await Hotel.findById(hotelID);

      // ==================================================
      console.log("=== Selected Hotel ===: ", selectedHotel);
      console.log("=== Hotel-ID ===: ", hotelID);
      // ==================================================

      selectedHotel.rooms.push(newRoomID);
      selectedHotel.save();

      res.status(200).json({ message: "Add new room process is successful!" });
    })
    .catch((err) => {
      console.log("Error in add new room: ", err);
      res.json({ message: err });
    });
};

// Action for edit room
exports.postEditRoom = async (req, res, next) => {
  const roomData = req.body.roomData;
  const roomID = roomData._id;

  const newRoomData = await Room.findByIdAndUpdate(
    roomID,
    { $set: roomData },
    { new: true, runValidators: true }
  );

  // ==============================================================
  console.log("Edit room process is successful!");
  console.log("====== New Room =======: ", newRoomData);
  // ==============================================================

  res.status(200).json({ message: "Edit room process is successful!" });
};
