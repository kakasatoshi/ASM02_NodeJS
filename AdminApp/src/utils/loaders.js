import { redirect } from "react-router-dom";
import {
  checkLogin,
  getAllHotels,
  getAllRooms,
  getAllTransactions,
  getAllUsers,
} from "./common";

// This loader to protect for routers
export async function protectRouterLoader() {
  const isLoggedIn = await checkLogin();
  if (!isLoggedIn) {
    window.location.href = "/admin/login";
    return true;
  } else {
    return false;
  }
}

// This loader to handle for router("/admin/login"): If user is logged in then redirect to router("/")
export async function handlerForLoginRouter() {
  const isLoggedIn = await checkLogin();
  if (isLoggedIn) return redirect("/");

  return null;
}

// This loader for router("/")
export async function loaderForDashBoard() {
  const [isLogout, userData, transactionData] = await Promise.all([
    protectRouterLoader(),
    getAllUsers(),
    getAllTransactions(),
  ]);

  if (isLogout) return null;

  const userQuantity = userData.length;
  return { userQuantity, transactionData };
}

// This loader for router("/hotel")
export async function loaderForHotel() {
  const [isLogout, hotelData] = await Promise.all([
    protectRouterLoader(),
    getAllHotels(),
  ]);

  if (isLogout) return null;

  return hotelData;
}

// This loader for router("/new-hotel")
export async function loaderForNewHotel() {
  const [isLogout, roomData] = await Promise.all([
    protectRouterLoader(),
    getAllRooms(),
  ]);
  if (isLogout) return null;

  return roomData;
}

// This loader for router("/hotel/edit-hotel")
export async function loaderForEditHotel() {
  const [isLogout, roomData] = await Promise.all([
    protectRouterLoader(),
    getAllRooms(),
  ]);
  if (isLogout) return null;

  return roomData;
}

// This loader for router("/room")
export async function loaderForRoom() {
  const [isLogout, roomData] = await Promise.all([
    protectRouterLoader(),
    getAllRooms(),
  ]);
  if (isLogout) return null;

  return roomData;
}

// This loader for router("/new-room")
export async function loaderForNewRoom() {
  const [isLogout, hotelData] = await Promise.all([
    protectRouterLoader(),
    getAllHotels(),
  ]);

  if (isLogout) return null;

  return hotelData;
}

// This loader for router("/transaction")
export async function loaderForTransaction() {
  const [isLogout, userData, transactionData] = await Promise.all([
    protectRouterLoader(),
    getAllUsers(),
    getAllTransactions(),
  ]);

  if (isLogout) return null;

  const userQuantity = userData.length;
  return { userQuantity, transactionData };
}
