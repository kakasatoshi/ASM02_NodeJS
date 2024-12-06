import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Home from "./pages/home/Home";
import Detail from "./pages/detail/Detail";
import Search from "./pages/search/Search";
import Authen from "./pages/authen/Authen";
import { authAction } from "./utils/actions";
import {
  getAuthenInforLoader,
  handlerForAuthRouter,
  protectRouterLoader,
} from "./utils/loaders";
import ErrorPage from "./pages/errorpage/ErrorPage";
import Layout from "./pages/Layout/Layout";
import Booking from "./pages/booking/Booking";
import Transactions from "./pages/transactions/Transactions";

const router = createBrowserRouter([
  {
    path: "/",
    errorElement: <ErrorPage />,
    loader: getAuthenInforLoader,
    element: <Layout />,
    children: [
      {
        path: "auth",
        element: <Authen />,
        action: authAction,
        loader: handlerForAuthRouter,
      },
      {
        path: "",
        element: <Home />,
      },
      {
        path: "search",
        element: <Search />,
        loader: protectRouterLoader,
      },
      {
        path: "detail/:hotelID",
        element: <Detail />,
        loader: protectRouterLoader,
      },
      {
        path: "booking",
        element: <Booking />,
        loader: protectRouterLoader,
      },
      {
        path: "transactions",
        element: <Transactions />,
        loader: protectRouterLoader,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}
export default App;
