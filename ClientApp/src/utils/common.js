import { json } from "react-router-dom";

export async function getActiveUserInfor() {
  const response = await fetch(
    "http://localhost:5000/client/getActiveUserInfor",
    {
      method: "GET",
      credentials: "include",
    }
  );

  if (!response.ok) {
    throw json({ status: 500, message: "Fetching process was failed!" });
  }

  const resData = await response.json();

  return resData;
}

export async function checkLogin() {
  const sessionData = await getActiveUserInfor();
  const isLoggedIn = sessionData.session.isLoggedIn;
  if (!isLoggedIn) {
    // Clear all data in local storage
    localStorage.clear();

    // Reset search params in context
    const dataCTX = window.context;
    dataCTX?.setSearchParamsFunction(null, null, null, null, null);

    // "window.navigate" được định nghĩa bên file "Layout.jsx"
    const navigate = window.navigate;
    if (navigate) {
      navigate("/auth?mode=login");
    }
  }
  return isLoggedIn;
}

// This function to get general information of hotel
export async function getDataOfHotel() {
  const response = await fetch("http://localhost:5000/client/get-hotel-data", {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    throw json({ status: 500, message: "Fetching process was failed!" });
  }
  const resData = await response.json();

  return resData;
}

// This function to send request to server and get data hotel for searching
export async function getHotelDataForSearching(
  city,
  dateStart,
  dateEnd,
  totalPeople,
  roomQuantity,
  minPrice = null,
  maxPrice = null
) {
  // Kiểm tra nếu người dùng chưa login thì chuyển hướng về trang login và dừng hàm
  // (việc chuyển hướng về trang login được thực hiện trong hàm "checkLogin()")
  const isLoggedIn = await checkLogin();
  if (!isLoggedIn) return;

  // Nếu người dùng đã đăng nhập thì lưu tham số tìm kiếm vào local storage
  localStorage.setItem(
    "searchParams",
    JSON.stringify({
      city,
      totalPeople,
      roomQuantity,
      minPrice,
      maxPrice,
    })
  );

  //  Fetch API to backend
  let searchResult;
  if (
    city !== "" &&
    dateStart !== null &&
    dateEnd !== null &&
    totalPeople > 0 &&
    roomQuantity > 0
  ) {
    const response = await fetch("http://localhost:5000/client/search-hotel", {
      method: "POST",
      credentials: "include",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        searchParams: {
          city,
          dateStart,
          dateEnd,
          totalPeople,
          roomQuantity,
          minPrice,
          maxPrice,
        },
      }),
    });

    if (!response.ok) {
      throw json({ status: 500, message: "Searching process was failed!" });
    }
    searchResult = await response.json();
  }

  return searchResult;
}

export async function getHotelDetails(hotelID) {
  // Kiểm tra nếu người dùng chưa login thì chuyển hướng về trang login và dừng hàm
  // (việc chuyển hướng về trang login được thực hiện trong hàm "checkLogin()")
  const isLoggedIn = await checkLogin();
  if (!isLoggedIn) return;

  // Nếu người dùng đã đăng nhập thì thực hiện gọi API đến backend
  const response = await fetch("http://localhost:5000/client/details-hotel", {
    method: "POST",
    credentials: "include",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({ hotelID }),
  });

  if (!response.ok) {
    throw json({ status: 500, message: "Get details process was failed!" });
  }
  const hotelDetails = await response.json();

  return hotelDetails;
}

// This function to get general information of hotel
export async function getTransactionDataByEmail(userEmail) {
  // Kiểm tra nếu người dùng chưa login thì chuyển hướng về trang login và dừng hàm
  // (việc chuyển hướng về trang login được thực hiện trong hàm "checkLogin()")
  const isLoggedIn = await checkLogin();
  if (!isLoggedIn) return;

  // Nếu người dùng đã đăng nhập thì thực hiện gọi API đến backend
  const response = await fetch("http://localhost:5000/client/transactions", {
    method: "POST",
    credentials: "include",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({ userEmail }),
  });

  if (!response.ok) {
    throw json({
      status: 500,
      message: "Get transactions process was failed!",
    });
  }
  const transactionData = await response.json();

  return transactionData;
}

// This function to post booking data to "transaction" model
export async function postBookingData(bookingInfor) {
  // Kiểm tra nếu người dùng chưa login thì chuyển hướng về trang login và dừng hàm
  // (việc chuyển hướng về trang login được thực hiện trong hàm "checkLogin()")
  const isLoggedIn = await checkLogin();
  if (!isLoggedIn) return;

  // Nếu người dùng đã đăng nhập thì thực hiện gọi API đến backend
  const response = await fetch("http://localhost:5000/client/booking", {
    method: "POST",
    credentials: "include",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({ bookingInfor }),
  });

  if (!response.ok) {
    throw json({ status: 500, message: "Booking process was failed!" });
  }
  const resBooking = await response.json();

  return resBooking;
}
