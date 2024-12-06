import styles from "./Transactions.module.css";
import { Fragment, useEffect, useState } from "react";
import {
  getActiveUserInfor,
  getTransactionDataByEmail,
} from "../../utils/common";

const Transactions = () => {
  const [transactionData, setTransactionData] = useState(null);

  let transactionListEL;
  // Define "transactionList" element
  if (transactionData?.length > 0) {
    transactionListEL = (
      <div>
        {/* <!-- Header --> */}
        <div
          className={`${styles["header"]} row ${styles["custom-border"]} text-white`}
        >
          <div className={`${styles["order-number"]}`}>#</div>
          <div className={`${styles["hotel-name"]}`}>Hotel</div>
          <div className={`${styles["room-number"]}`}>Room</div>
          <div className={`${styles["booking-date"]}`}>Date</div>
          <div className={`${styles["total-amount"]}`}>Price</div>
          <div className={`${styles["payment-method"]}`}>Payment Method</div>
          <div className={` ${styles["booking-status"]}`}>Status</div>
        </div>
        <div className={styles["container-content"]}>
          {transactionData.map((item, index) => (
            /* <!-- Content --> */
            <div
              key={index}
              className={`${styles["content"]} ${styles["custom-border"]} row`}
            >
              <div className={`${styles["order-number"]}`}>
                {(index + 1).toString().padStart(2, "0")}
              </div>
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
              <div className={`${styles["total-amount"]}`}>
                ${item.totalBill}
              </div>
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
  }

  useEffect(() => {
    // Call this function to get email of user from database
    getActiveUserInfor()
      .then((resData) => {
        const userEmail = resData.session.user.email;
        getTransactionDataByEmail(userEmail).then((data) => {
          setTransactionData(data);
        });
      })
      .catch((err) => console.log("Error Information: ", err));
  }, []);
  return (
    <Fragment>
      <div className={styles["div-container"]}>
        {!transactionData && (
          <div className={styles["text-infor"]}>Your transactions in here!</div>
        )}

        {transactionData?.length === 0 && (
          <div
            className={`${styles["text-infor"]} ${styles["no-transaction"]}`}
          >
            You have not any transactions!
          </div>
        )}

        {transactionData?.length > 0 && (
          <div>
            <p className={`${styles["top-title"]} row`}>Your Transactions</p>
            {transactionListEL}
          </div>
        )}
      </div>
    </Fragment>
  );
};

export default Transactions;
