import { json } from "react-router-dom";

// Action for Authentication
export async function loginAction({ request, params }) {
  // Get data form Signin/Signup form
  const formData = await request.formData();
  const email = formData.get("email");
  const password = formData.get("password");

  // Data for Authen
  const loginInfor = { email, password };

  // Fetching to backend
  const response = await fetch("http://localhost:5000/admin/login", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(loginInfor),
    credentials: "include",
  });

  if (!response.ok) {
    throw json({ status: 500, message: "Login for admin process was failed!" });
  }

  const resData = await response.json();
  const messageContent = resData;

  return messageContent;
}
