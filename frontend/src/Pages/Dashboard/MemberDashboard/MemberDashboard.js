import React, { useContext, useEffect, useState } from "react";
import "../AdminDashboard/AdminDashboard.css";
import "./MemberDashboard.css";

import LibraryBooksIcon from "@material-ui/icons/LibraryBooks";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import BookIcon from "@material-ui/icons/Book";
import HistoryIcon from "@material-ui/icons/History";
import LocalLibraryIcon from "@material-ui/icons/LocalLibrary";
import PowerSettingsNewIcon from "@material-ui/icons/PowerSettingsNew";
import CloseIcon from "@material-ui/icons/Close";
import DoubleArrowIcon from "@material-ui/icons/DoubleArrow";
import { IconButton } from "@material-ui/core";
import axios from "axios";
import { AuthContext } from "../../../Context/AuthContext";

function MemberDashboard() {
  const [active, setActive] = useState("profile");
  const [sidebar, setSidebar] = useState(false);

  const API_URL = process.env.REACT_APP_API_URL || "https://library-management-system-mern-master-wrht.onrender.com";
  const { user } = useContext(AuthContext);

  const [memberDetails, setMemberDetails] = useState(null);
  const [transactions, setTransactions] = useState([]);

  /* FETCH MEMBER DETAILS */
  useEffect(() => {
    const getMemberDetails = async () => {
      try {
        const response = await axios.get(API_URL + "api/users/getuser/" + user._id);
        setMemberDetails(response.data);
      } catch (err) {
        console.log("Error fetching member details");
      }
    };
    getMemberDetails();
  }, [API_URL, user]);

  /* FETCH ALL TRANSACTIONS OF USER */
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await axios.get(API_URL + "api/transactions/all-transactions");
        const userTx = res.data.filter((tx) => tx.borrowerId === user._id);
        setTransactions(userTx);
      } catch (err) {
        console.log(err);
      }
    };

    fetchTransactions();
  }, [API_URL, user]);

  /* CATEGORIZE TRANSACTIONS */
  const issued = transactions.filter((tx) => tx.transactionType === "Issued");
  const reserved = transactions.filter((tx) => tx.transactionType === "Reserved");
  const purchased = transactions.filter((tx) => tx.transactionType === "purchased");

  /* HISTORY SHOULD SHOW PURCHASE + RETURN */
  const history = transactions.filter(
    (tx) => tx.transactionType === "purchased" || tx.transactionType === "Returned"
  );

  /* RETURN BOOK */
  const returnBook = async (id) => {
    try {
      await axios.put(API_URL + "api/transactions/return/" + id);
      alert("Book returned successfully!");
      window.location.reload();
    } catch (err) {
      console.log(err);
      alert("Return failed. Check console.");
    }
  };

  const logout = () => {
    localStorage.removeItem("user");
    window.location.reload();
  };

  return (
    <div className="dashboard">
      <div className="dashboard-card">

        {/* SIDEBAR TOGGLE */}
        <div className="sidebar-toggler" onClick={() => setSidebar(!sidebar)}>
          <IconButton>
            {sidebar ? (
              <CloseIcon style={{ fontSize: 25, color: "rgb(234, 68, 74)" }} />
            ) : (
              <DoubleArrowIcon style={{ fontSize: 25, color: "rgb(234, 68, 74)" }} />
            )}
          </IconButton>
        </div>

        {/* SIDEBAR */}
        <div className={sidebar ? "dashboard-options active" : "dashboard-options"}>
          <div className="dashboard-logo">
            <LibraryBooksIcon style={{ fontSize: 50 }} />
            <p className="logo-name">LCMS</p>
          </div>

          <a className={`dashboard-option ${active === "profile" ? "clicked" : ""}`}
             onClick={() => { setActive("profile"); setSidebar(false); }}>
            <AccountCircleIcon className="dashboard-option-icon" /> Profile
          </a>

          <a className={`dashboard-option ${active === "active" ? "clicked" : ""}`}
             onClick={() => { setActive("active"); setSidebar(false); }}>
            <LocalLibraryIcon className="dashboard-option-icon" /> Active
          </a>

          <a className={`dashboard-option ${active === "reserved" ? "clicked" : ""}`}
             onClick={() => { setActive("reserved"); setSidebar(false); }}>
            <BookIcon className="dashboard-option-icon" /> Reserved
          </a>

          <a className={`dashboard-option ${active === "history" ? "clicked" : ""}`}
             onClick={() => { setActive("history"); setSidebar(false); }}>
            <HistoryIcon className="dashboard-option-icon" /> History
          </a>

          <a className="dashboard-option" onClick={logout}>
            <PowerSettingsNewIcon className="dashboard-option-icon" /> Log out
          </a>
        </div>

        {/* RIGHT SIDE CONTENT */}
        <div className="dashboard-option-content">

          {/* PROFILE */}
          {active === "profile" && (
            <div className="member-profile-content">
              <div className="user-details-topbar">
                <img className="user-profileimage" src="./assets/images/Profile.png" alt="" />
                <div className="user-info">
                  <p className="user-name">{memberDetails?.userFullName}</p>
                  <p className="user-id">
                    {memberDetails?.userType === "Student"
                      ? memberDetails?.admissionId
                      : memberDetails?.employeeId}
                  </p>
                  <p className="user-email">{memberDetails?.email}</p>
                  <p className="user-phone">{memberDetails?.mobileNumber}</p>
                </div>
              </div>
            </div>
          )}

          {/* ACTIVE TAB */}
          {active === "active" && (
            <div className="member-activebooks-content">

              {/* ISSUED BOOKS */}
              <p className="member-dashboard-heading">Issued Books</p>
              <table className="activebooks-table">
                <thead>
                  <tr>
                    <th>S.No</th>
                    <th>Book Name</th>
                    <th>From</th>
                    <th>To</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {issued.length === 0 ? (
                    <tr><td colSpan="5">No Issued Books</td></tr>
                  ) : (
                    issued.map((data, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{data.bookName}</td>
                        <td>{new Date(data.fromDate).toLocaleString()}</td>
                        <td>{new Date(data.toDate).toLocaleString()}</td>
                        <td>
                          <button className="return-btn" onClick={() => returnBook(data._id)}>
                            Return
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>

              {/* PURCHASED BOOKS */}
              <br />
              <p className="member-dashboard-heading">Purchased Books</p>
              <table className="activebooks-table">
                <thead>
                  <tr>
                    <th>S.No</th>
                    <th>Book Name</th>
                    <th>Date</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {purchased.length === 0 ? (
                    <tr><td colSpan="4">No Purchased Books</td></tr>
                  ) : (
                    purchased.map((p, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{p.bookName}</td>
                        <td>{new Date(p.fromDate).toLocaleDateString()}</td>
                        <td>
                          <button className="return-btn" onClick={() => returnBook(p._id)}>
                            Return
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* RESERVED TAB */}
          {active === "reserved" && (
            <div className="member-reservedbooks-content">
              <p className="member-dashboard-heading">Reserved Books</p>
              <table className="activebooks-table">
                <thead>
                  <tr>
                    <th>S.No</th>
                    <th>Book Name</th>
                    <th>From</th>
                    <th>To</th>
                  </tr>
                </thead>

                <tbody>
                  {reserved.length === 0 ? (
                    <tr><td colSpan="4">No Reserved Books</td></tr>
                  ) : (
                    reserved.map((data, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{data.bookName}</td>
                        <td>{new Date(data.fromDate).toLocaleString()}</td>
                        <td>{new Date(data.toDate).toLocaleString()}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* HISTORY TAB */}
          {active === "history" && (
            <div className="member-history-content">
              <p className="member-dashboard-heading">History</p>

              <table className="activebooks-table">
                <thead>
                  <tr>
                    <th>S.No</th>
                    <th>Book Name</th>
                    <th>From</th>
                    <th>To / Returned</th>
                    <th>Status</th>
                  </tr>
                </thead>

                <tbody>
                  {history.length === 0 ? (
                    <tr><td colSpan="5">No History</td></tr>
                  ) : (
                    history.map((data, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{data.bookName}</td>
                        <td>{new Date(data.fromDate).toLocaleString()}</td>

                        {/* TO / RETURN DATE */}
                        <td>
                          {data.transactionType === "Returned"
                            ? new Date(data.returnDate).toLocaleDateString()
                            : "Purchased — Not Returned"}
                        </td>

                        {/* STATUS */}
                        <td style={{ textTransform: "capitalize" }}>
                          {data.transactionType}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default MemberDashboard;
