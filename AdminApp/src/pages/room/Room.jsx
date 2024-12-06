import { Link, useLoaderData, useNavigate } from "react-router-dom";
import styles from "./Room.module.css";
import { useEffect, useState } from "react";
import {
  checkLogin,
  getAllRooms,
  paginate,
  postDeleteRoom,
} from "../../utils/common";

export default function Room() {
  const resData = useLoaderData();
  const [roomData, setRoomData] = useState(resData);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;
  const [listRooms, setListRooms] = useState(roomData.slice(0, pageSize));
  const navigate = useNavigate();

  // Get total of page:
  const totalPage = Math.ceil(roomData.length / pageSize);

  // Define disable status for "previous page" and "next page" Button
  const disablePrev = currentPage === 1 ? "disable" : "";
  const disableNext = currentPage === totalPage ? "disable" : "";

  // Define list of room element "roomListEL"
  const roomListEL = (
    <div>
      {/* <!-- Header --> */}
      <div className={`${styles["header"]} d-flex ${styles["custom-border"]}`}>
        <div className={`${styles["check-box"]} ${styles["check-box-head"]}`}>
          <input type="checkbox" />
        </div>
        <div className={`${styles["roomID"]}`}>ID</div>
        <div className={`${styles["room-title"]}`}>Title</div>
        <div className={`${styles["room-description"]}`}>Description</div>
        <div className={`${styles["room-price"]}`}>Price</div>
        <div className={`${styles["max-people"]}`}>Max People</div>
        <div className={`${styles["action"]} ${styles["action-header"]}`}>
          Action
        </div>
      </div>
      <div className={`${styles["container-content"]} border`}>
        {roomData?.length > 0 &&
          listRooms.map((item, index) => (
            /* <!-- Content --> */
            <div key={index} className={`${styles["content"]}  d-flex`}>
              <div className={`${styles["check-box"]}`}>
                <input type="checkbox" />
              </div>
              <div className={`${styles["roomID"]}`}>{item._id}</div>
              <div className={`${styles["room-title"]}`}>{item.title}</div>
              <div className={`${styles["room-description"]}`}>{item.desc}</div>
              <div className={`${styles["room-price"]}`}>{item.price}</div>
              <div className={`${styles["max-people"]}`}>{item.maxPeople}</div>
              <div className={`${styles["action"]}`}>
                <button
                  className={styles["delete-btn"]}
                  onClick={() => deleteRoomHandler(item._id)}
                >
                  Delete
                </button>

                <Link
                  to={"edit-room"}
                  state={{ roomID: item._id }}
                  className={styles["edit-btn"]}
                >
                  Edit
                </Link>
              </div>
            </div>
          ))}

        {roomData?.length === 0 && (
          <div className={`${styles["text-infor"]} ${styles["no-room"]} `}>
            Database have not any rooms!
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
  async function deleteRoomHandler(roomID) {
    const isLoggedIn = await checkLogin();
    if (isLoggedIn) {
      const confirm = window.confirm("Do you realy want to delete this room?");
      if (confirm) {
        const resData = await postDeleteRoom(roomID);
        const resMessage = resData.message;
        if (resMessage === "Room is booked") {
          alert("This room has been booked, you can not delete it!");
        } else {
          // Recall getAllRooms function to re-render page (update page)
          const newDataOfRoom = await getAllRooms();
          setRoomData(newDataOfRoom);
        }
      }
    } else {
      navigate("/admin/login");
    }
  }

  // This Effect() hook to control paging
  useEffect(() => {
    let newList = paginate(roomData, pageSize, currentPage);

    // If hotel list of current page is empty (delete all rooms in current page) then show previous page
    if (newList.length === 0 && pageSize > 1) {
      setCurrentPage((prev) => prev - 1);
      newList = paginate(roomData, pageSize, currentPage - 1);
    }

    // Update "listRooms" status
    setListRooms(newList);
  }, [currentPage, roomData]);

  return (
    <div className={`${styles["dash-board-container"]} `}>
      <div className={`${styles["list-room"]}`}>
        {/* Section-1: List of rooms */}
        <div>
          <div className={`${styles["head-list-room"]} rows`}>
            <p className={`${styles["title-list-room"]}`}>Rooms List</p>
            <Link className={`${styles["new-room-btn"]}`} to={"new-room"}>
              Add New
            </Link>
          </div>
          {roomListEL}
        </div>

        {/* Section-2: Paging Control */}
        {totalPage > 1 && (
          <div
            className={`${styles["paging-container"]} d-flex justify-content-end border`}
          >
            <div>
              <span>
                1-{listRooms.length} of {currentPage}
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
