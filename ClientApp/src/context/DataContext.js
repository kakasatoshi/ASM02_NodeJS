import React, { useState, useEffect } from "react";
import { getAuthenInforLoader, getHotelDataLoader } from "../utils/loaders";

// Creat a context
const DataContext = React.createContext({
  authData: { message: null, isAuthError: false },
  activeUser: { email: null, isLoggedIn: false },
  hotelData: [],
  searchParams: {
    city: null,
    dateStart: null,
    dateEnd: null,
    totalPeople: null,
    roomQuantity: null,
  },
  hotelDataForBooking: [],
  setAuthDataFunction: () => {},
  setActiveUserFunction: (email, isLoggedIn) => {},
  setHotelDataFunction: () => {},
  setSearchParamsFunction: (
    city,
    dateStart,
    dateEnd,
    totalPeople,
    roomQuantity
  ) => {},
  setHotelDataForBookingFunction: (data) => {},
});
export default DataContext;

// Define a component
export const DataContextProvider = (props) => {
  // ========================== PART-1: CREATE SOME STATES FOR CONTEXT =================================
  // Using "useState()" hook to create some states
  const [authData, setAuData] = useState();
  const [activeUser, setActiveUser] = useState({
    email: null,
    isLoggedIn: false,
  });
  const [hotelData, setHotelData] = useState([]);
  const [searchParams, setSearchParams] = useState({
    city: null,
    dateStart: null,
    dateEnd: null,
    totalPeople: null,
    roomQuantity: null,
  });

  const [hotelDataForBooking, setHotelDataForBooking] = useState([]);

  // ========================== PART-2: DEFINE SOME FUNCTIONS FOR CONTEXT ==========================
  // Define "setAuthDataFunction" to get data of authentication
  const setAuthDataFunction = () => {};

  // Define "setActiveUserFunction" to get data of active user
  const setActiveUserFunction = (email, isLoggedIn) => {
    setActiveUser({ email, isLoggedIn });
  };

  // Define "setHotelDataFunction" to get data of hotel
  const setHotelDataFunction = () => {
    getHotelDataLoader().then((hotelData) => {
      setHotelData(hotelData);
    });
  };

  // Define "setSearchParamsFunction" to get data of searching
  const setSearchParamsFunction = (
    city,
    dateStart,
    dateEnd,
    totalPeople,
    roomQuantity
  ) => {
    setSearchParams({ city, dateStart, dateEnd, totalPeople, roomQuantity });
  };

  const setHotelDataForBookingFunction = (data) => {
    setHotelDataForBooking(data);
  };

  return (
    <DataContext.Provider
      value={{
        authData,
        activeUser,
        hotelData,
        searchParams,
        hotelDataForBooking,
        setAuthDataFunction,
        setActiveUserFunction,
        setHotelDataFunction,
        setSearchParamsFunction,
        setHotelDataForBookingFunction,
      }}
    >
      {props.children}
    </DataContext.Provider>
  );
};
