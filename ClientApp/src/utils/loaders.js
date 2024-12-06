import { json, redirect } from "react-router-dom";
import { checkLogin, getActiveUserInfor, getDataOfHotel } from "./common";

// This loader to get information of user and status of login
export async function getAuthenInforLoader() {
  const resData = await getActiveUserInfor();
  return resData;
}

// This loader to get data of hotel
export async function getHotelDataLoader() {
  const hotelData = await getDataOfHotel();
  return hotelData;
}

// This loader to protect for routers
export async function protectRouterLoader() {
  const isLoggedIn = await checkLogin();
  if (!isLoggedIn) return redirect("/auth?mode=login");

  return null;
}

// This loader to handle for router("/auth"): If user is logged in then redirect to "Home" page
export async function handlerForAuthRouter() {
  const sessionData = await getActiveUserInfor();
  const isLoggedIn = sessionData.session.isLoggedIn;
  if (isLoggedIn) return redirect("/");

  return null;
}
