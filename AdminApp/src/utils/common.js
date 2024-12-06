import { json } from "react-router-dom";

// This funtion to paging the results
export function paginate(array, page_size, page_number) {
  // human-readable page numbers usually start with 1, so we reduce 1 in the first argument
  return array.slice((page_number - 1) * page_size, page_number * page_size);
}

// This function to check login status
export async function checkLogin() {
  const sessionData = await getActiveUserInfor();
  const isLoggedIn = sessionData.session.isLoggedIn;

  return isLoggedIn;
}

// Defines "getFetching" function is sharing to used for difference functions

export async function getFetching(urlString, messageString) {
  const response = await fetch(urlString, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    throw json({ status: 500, message: messageString });
  }
  const resData = await response.json();

  return resData;
}

// Defines "postFetching" function is sharing to used for difference functions

export async function postFetching(urlString, bodyData, messageString) {
  const response = await fetch(urlString, {
    method: "POST",
    credentials: "include",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(bodyData),
  });

  if (!response.ok) {
    throw json({ status: 500, message: messageString });
  }
  const resData = await response.json();

  return resData;
}

// This function to get information of active user
export async function getActiveUserInfor() {
  const urlString = "http://localhost:5000/admin/getActiveUserInfor";
  const messageString =
    "Fetching for get information of active user was failed!";
  const resData = await getFetching(urlString, messageString);

  return resData;
}

// This function to get all users
export async function getAllUsers() {
  const urlString = "http://localhost:5000/admin/get-users";
  const messageString = "Get all users process is failed!";
  const resData = await getFetching(urlString, messageString);

  return resData;
}

// This function to get all hotels
export async function getAllHotels() {
  const urlString = "http://localhost:5000/admin/get-all-hotels";
  const messageString = "Get all hotels process is failed!";
  const resData = await getFetching(urlString, messageString);

  return resData;
}

// This function to get hotel by hotelID
export async function getHotelByID(hotelID) {
  const urlString = "http://localhost:5000/admin/get-hotel";
  const messageString = "Get hotel process is failed!";
  const bodyData = { hotelID };
  const resData = await postFetching(urlString, bodyData, messageString);

  return resData;
}

// This function to get all room types
export async function getAllRooms() {
  const urlString = "http://localhost:5000/admin/get-rooms";
  const messageString = "Get all rooms process is failed!";
  const resData = await getFetching(urlString, messageString);
  const roomData = resData.map((i) => ({
    ...i,
    isSelected: false,
  }));

  return roomData;
}

// This function to get information of room (get room by roomID)
export async function getRoomByID(roomID) {
  const urlString = "http://localhost:5000/admin/get-room-infor";
  const messageString = "Get room information process is failed!";
  const bodyData = { roomID };
  const roomInfor = await postFetching(urlString, bodyData, messageString);

  return roomInfor;
}

// This function to get all transactions
export async function getAllTransactions() {
  const urlString = "http://localhost:5000/admin/get-alltransactions";
  const messageString = "Get all transactions process is failed!";
  const resData = await getFetching(urlString, messageString);

  return resData;
}

// This function to delete hotel
export async function postDeleteHotel(hotelID) {
  const urlString = "http://localhost:5000/admin/delete-hotel";
  const messageString = "Delete hotel process is failed!";
  const bodyData = { hotelID };
  const resData = await postFetching(urlString, bodyData, messageString);

  return resData;
}

// This function to add new hotel
export async function postAddNewHotel(hotelData) {
  const urlString = "http://localhost:5000/admin/add-new-hotel";
  const messageString = "Add new hotel process is failed!";
  const bodyData = { hotelData };
  const resData = await postFetching(urlString, bodyData, messageString);

  return resData;
}

// This function to edit hotel
export async function postEditHotel(hotelData) {
  const urlString = "http://localhost:5000/admin/edit-hotel";
  const messageString = "Edit hotel process is failed!";
  const bodyData = { hotelData };
  const resData = await postFetching(urlString, bodyData, messageString);

  return resData;
}

// This function to delete room
export async function postDeleteRoom(roomID) {
  const urlString = "http://localhost:5000/admin/delete-room";
  const messageString = "Delete room process is failed!";
  const bodyData = { roomID };
  const resData = await postFetching(urlString, bodyData, messageString);

  return resData;
}

// This function to add new room
export async function postAddNewRoom(requestData) {
  const urlString = "http://localhost:5000/admin/add-new-room";
  const messageString = "Add new room process is failed!";
  const bodyData = { requestData };
  const resData = await postFetching(urlString, bodyData, messageString);

  return resData;
}

// This function to edit room
export async function postEditRoom(roomData) {
  const urlString = "http://localhost:5000/admin/edit-room";
  const messageString = "Edit room process is failed!";
  const bodyData = { roomData };
  const resData = await postFetching(urlString, bodyData, messageString);

  return resData;
}
