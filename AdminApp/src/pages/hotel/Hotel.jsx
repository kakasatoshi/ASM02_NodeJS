import { Link, useLoaderData, useNavigate } from "react-router-dom";
import styles from "./Hotel.module.css";
import { useEffect, useState } from "react";
import {
  checkLogin,
  getAllHotels,
  paginate,
  postDeleteHotel,
} from "../../utils/common";

export default function Hotel() {
  const resData = useLoaderData();
  const [hotelData, setHotelData] = useState(resData);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;
  const [listHotels, setListHotels] = useState(hotelData.slice(0, pageSize));
  const navigate = useNavigate();

  // Get total of page:
  const totalPage = Math.ceil(hotelData.length / pageSize);

  // Define disable status for "previous page" and "next page" Button
  const disablePrev = currentPage === 1 ? "disable" : "";
  const disableNext = currentPage === totalPage ? "disable" : "";

  // Define list of hotel element "hotelListEL"
  const hotelListEL = (
    <div>
      {/* <!-- Header --> */}
      <div className={`${styles["header"]} d-flex ${styles["custom-border"]}`}>
        <div className={`${styles["check-box"]} ${styles["check-box-head"]}`}>
          <input type="checkbox" />
        </div>
        <div className={`${styles["hotelID"]}`}>ID</div>
        <div className={`${styles["hotel-name"]}`}>Name</div>
        <div className={`${styles["hotel-type"]}`}>Type</div>
        <div className={`${styles["hotel-title"]}`}>Title</div>
        <div className={`${styles["city"]}`}>City</div>
        <div className={`${styles["action"]} ${styles["action-header"]}`}>
          Action
        </div>
      </div>
      <div className={`${styles["container-content"]} border`}>
        {hotelData?.length > 0 &&
          listHotels.map((item, index) => (
            /* <!-- Content --> */
            <div key={index} className={`${styles["content"]}  d-flex`}>
              <div className={`${styles["check-box"]}`}>
                <input type="checkbox" />
              </div>
              <div className={`${styles["hotelID"]}`}>{item._id}</div>
              <div className={`${styles["hotel-name"]}`}>{item.name}</div>
              <div className={`${styles["hotel-type"]}`}>{item.type}</div>
              <div className={`${styles["hotel-title"]}`}>{item.title}</div>
              <div className={`${styles["city"]}`}>{item.city}</div>
              <div className={`${styles["action"]}`}>
                <button
                  className={styles["delete-btn"]}
                  onClick={() => deleteHotelHandler(item._id)}
                >
                  Delete
                </button>

                <Link
                  to={"edit-hotel"}
                  state={{ hotelID: item._id }}
                  className={styles["edit-btn"]}
                >
                  Edit
                </Link>
              </div>
            </div>
          ))}

        {hotelData?.length === 0 && (
          <div className={`${styles["text-infor"]} ${styles["no-hotel"]} `}>
            Database have not any hotels!
          </div>
        )}
      </div>
    </div>
  );

  // This function to handle for event click of paging button
  function pagingHandler(pagingAction) {
    if (pagingAction === "previous") {
      if (currentPage > 1) setCurrentPage((prev) => prev - 1);
      return;
    }

    if (pagingAction === "next") {
      if (currentPage < totalPage) setCurrentPage((prev) => prev + 1);
      return;
    }
  }

  // This function to handle for event click of delete button
  async function deleteHotelHandler(hotelID) {
    const isLoggedIn = await checkLogin();
    if (isLoggedIn) {
      const confirm = window.confirm("Do you realy want to delete this hotel?");
      if (confirm) {
        const resData = await postDeleteHotel(hotelID);
        const resMessage = resData.message;
        if (resMessage === "Hotel is booked") {
          alert("This hotel has been booked, you can not delete it!");
        } else {
          // Recall getHotel function to re-render page (update page)
          const newDataOfHotel = await getAllHotels();
          setHotelData(newDataOfHotel);
        }
      }
    } else {
      navigate("/admin/login");
    }
  }

  // This Effect() hook to control paging
  useEffect(() => {
    let newList = paginate(hotelData, pageSize, currentPage);

    // Nếu đang ở một trang nào đó mà xoá hết khách sạn trên trang đó thì giao diện sẽ hiển thị trang trước đó
    if (newList.length === 0 && pageSize > 1) {
      setCurrentPage((prev) => prev - 1);
      newList = paginate(hotelData, pageSize, currentPage - 1);
    }

    // Update "listHotels" status
    setListHotels(newList);
  }, [currentPage, hotelData]);

  return (
    <div className={`${styles["dash-board-container"]} `}>
      <div className={`${styles["list-hotel"]}`}>
        {/* Section-1: List of hotels */}
        <div>
          <div className={`${styles["head-list-hotel"]} rows`}>
            <p className={`${styles["title-list-hotel"]}`}>Hotels List</p>
            <Link className={`${styles["new-hotel-btn"]}`} to={"new-hotel"}>
              Add New
            </Link>
          </div>
          {hotelListEL}
        </div>

        {/* Section-2: Paging Control */}
        {totalPage > 1 && (
          <div
            className={`${styles["paging-container"]} d-flex justify-content-end border`}
          >
            <div>
              <span>
                1-{listHotels.length} of {currentPage}
              </span>
              <i
                className={`bi bi-chevron-left ${styles["previous-page"]} ${styles[disablePrev]}`}
                onClick={() => pagingHandler("previous")}
              />
              <i
                className={`bi bi-chevron-right ${styles["next-page"]} ${styles[disableNext]} `}
                onClick={() => pagingHandler("next")}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
