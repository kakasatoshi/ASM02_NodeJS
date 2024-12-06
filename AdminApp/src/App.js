import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Layout from "./UI/layout/Layout";
import ErrorPage from "./pages/errorpage/ErrorPage";
import DashBoard from "./pages/dash-board/DashBoard";
import Login from "./pages/login/Login";
import { loginAction } from "./utils/actions";
import {
  handlerForLoginRouter,
  loaderForDashBoard,
  loaderForHotel,
  loaderForNewHotel,
  loaderForNewRoom,
  loaderForRoom,
  loaderForTransaction,
  protectRouterLoader,
} from "./utils/loaders";
import Hotel from "./pages/hotel/Hotel";
import NewHotel from "./pages/hotel/NewHotel";
import Room from "./pages/room/Room";
import NewRoom from "./pages/room/NewRoom";
import Transaction from "./pages/transaction/Transaction";
import EditHotel from "./pages/hotel/EditHotel";
import EditRoom from "./pages/room/EditRoom";

const router = createBrowserRouter([
  {
    path: "/admin/login",
    element: <Login />,
    action: loginAction,
    loader: handlerForLoginRouter,
  },
  {
    path: "/",
    errorElement: <ErrorPage />,
    element: <Layout />,
    children: [
      {
        path: "",
        element: <DashBoard />,
        loader: loaderForDashBoard,
      },
      {
        path: "hotel",
        element: <Hotel />,
        loader: loaderForHotel,
      },
      {
        path: "hotel/new-hotel",
        element: <NewHotel />,
        loader: loaderForNewHotel,
      },
      {
        path: "hotel/edit-hotel",
        element: <EditHotel />,
        loader: loaderForNewHotel,
      },
      {
        path: "room",
        element: <Room />,
        loader: loaderForRoom,
      },
      {
        path: "room/new-room",
        element: <NewRoom />,
        loader: loaderForNewRoom,
      },
      {
        path: "room/edit-room",
        element: <EditRoom />,
        loader: protectRouterLoader,
      },
      {
        path: "transactions",
        element: <Transaction />,
        loader: loaderForTransaction,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}
export default App;
