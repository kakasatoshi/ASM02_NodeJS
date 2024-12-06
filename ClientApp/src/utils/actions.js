import { json, redirect } from "react-router-dom";

// Action for Authentication of "Client App"
export async function authAction({ request, params }) {
  // Get data form Signin/Signup form
  const formData = await request.formData();
  const email = formData.get("email");
  const password = formData.get("password");
  const authMode = formData.get("authMode");

  // Data for Authen
  const dataForAuthen = { email, password };

  // Fetching
  const apiURL = "http://localhost:5000/client/" + authMode;

  const response = await fetch(apiURL, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(dataForAuthen),
    credentials: "include",
  });

  if (!response.ok) {
    throw json({ status: 500, message: "Fetching process was failed!" });
  }

  const resData = await response.json();
  const messageContent = resData;

  return messageContent;
}
