import { useLoaderData } from "react-router-dom";
import styles from "./Transaction.module.css";
import { useEffect, useState } from "react";
import { paginate } from "../../utils/common";

export default function Transaction() {
  const resData = useLoaderData();
  const transactionData = resData.transactionData;
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 9;
  const [listTransactions, setListTransactions] = useState(
    transactionData.slice(0, pageSize)
  );

  // Get total of page:
  const totalPage = Math.ceil(transactionData.length / pageSize);

  // Define disable status for "previous page" and "next page" Button
  const disablePrev = currentPage === 1 ? "disable" : "";
  const disableNext = currentPage === totalPage ? "disable" : "";

  // Define transaction list element: "transactionEL"
  const transactionListEL = (
    <div>
      {/* <!-- Header --> */}
      <div className={`${styles["header"]} row ${styles["custom-border"]}`}>
        <div className={`${styles["check-box"]} ${styles["check-box-head"]}`}>
          <input type="checkbox" />
        </div>
        <div className={`${styles["transID"]}`}>ID</div>

        <div className={`${styles["user-name"]}`}>User</div>
        <div className={`${styles["hotel-name"]}`}>Hotel</div>
        <div className={`${styles["room-number"]}`}>Room</div>
        <div className={`${styles["booking-date"]}`}>Date</div>
        <div className={`${styles["total-amount"]}`}>Price</div>
        <div className={`${styles["payment-method"]}`}>Payment Method</div>
        <div
          className={`${styles["booking-status"]} ${styles["booking-status-head"]}`}
        >
          Status
        </div>
      </div>
      <div className={styles["container-content"]}>
        {listTransactions.map((item, index) => (
          /* <!-- Content --> */
          <div key={index} className={`${styles["content"]}  row`}>
            <div className={`${styles["check-box"]}`}>
              <input type="checkbox" />
            </div>
            <div className={`${styles["transID"]}`}>{item._id}</div>
            <div className={`${styles["user-name"]}`}>{item.user.fullName}</div>
            <div className={`${styles["hotel-name"]}`}>{item.hotel.name}</div>
            <div className={`${styles["room-number"]}`}>
              {item.rooms
                .map((i) => i.roomOrder.map((j) => ` ${j}`))
                .toString()
                .trim()}
            </div>
            <div className={`${styles["booking-date"]}`}>{`${new Date(
              item.dateStart
            ).toLocaleDateString("vi-VN")}-${new Date(
              item.dateEnd
            ).toLocaleDateString("vi-VN")}`}</div>
            <div className={`${styles["total-amount"]}`}>${item.totalBill}</div>
            <div className={`${styles["payment-method"]}`}>
              {item.paymentMethod}
            </div>
            <div className={`${styles["booking-status"]}`}>
              <span
                className={`${styles["status-style"]} ${styles[item.status]}`}
              >
                {item.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // This function to handler for event click of paging button
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

  // This Effect() hook to control paging
  useEffect(() => {
    const newList = paginate(transactionData, pageSize, currentPage);
    setListTransactions(newList);
  }, [currentPage]);

  return (
    <div className={`${styles["dash-board-container"]} `}>
      {/* List of transactions */}
      <div className={`${styles["list-transaction"]}`}>
        {transactionData?.length === 0 && (
          <div
            className={`${styles["text-infor"]} ${styles["no-transaction"]}`}
          >
            Database have not any transactions!
          </div>
        )}

        {transactionData?.length > 0 && (
          <div>
            <p className={`${styles["title-list-trans"]} row`}>
              Transactions List
            </p>
            {transactionListEL}
            <div className={`${styles["paging-container"]} row border`}>
              <div className={`${styles["paging-control"]}`}>
                <span>
                  1-{listTransactions.length} of {currentPage}
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
          </div>
        )}
      </div>
    </div>
  );
}
