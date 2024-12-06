// OK
import { Outlet, useLoaderData, useNavigate } from "react-router-dom";
import { Fragment, useContext, useEffect } from "react";
import DataContext from "../../context/DataContext";
import Navbar from "../home/components/Navbar/Navbar";
import Footer from "../home/components/Footer/Footer";
import RegisterForm from "../home/components/Body/RegisterForm";

export default function Layout() {
  const resData = useLoaderData();

  // Save context object (dataCTX) to context property of window: "window.context = dataCTX"
  const dataCTX = useContext(DataContext);
  window.context = dataCTX;

  // Save navigate object to navigate property of window: "window.navigate = navigate"
  const navigate = useNavigate();
  window.navigate = navigate;

  useEffect(() => {
    dataCTX.setHotelDataFunction();
  }, []);

  return (
    <Fragment>
      <Navbar sessionData={resData} />
      <Outlet />
      <RegisterForm />
      <Footer />
    </Fragment>
  );
}
