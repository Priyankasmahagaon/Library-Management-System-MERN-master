import React, { useContext } from "react";
import "./Allbooks.css";
import axios from "axios";
import { AuthContext } from "../Context/AuthContext";

function Allbooks() {
  const { user } = useContext(AuthContext);

  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:4000/";

  const handlePurchase = async (bookName) => {
    try {
      const res = await axios.post(API_URL + "api/transactions/purchase", {
        studentId: user?._id,
        bookName: bookName,   
        // Because your books are static and do not have IDs
        // We save by name for now
      });

      alert("Book purchased successfully!");
    } catch (err) {
      console.error(err);
      alert("Purchase failed.");
    }
  };

  return (
    <div className="books-page">
      <div className="books">
        
        {/* BOOK 1 */}
        <div className="book-card">
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQp16xiXu1ZtTzbLy-eSwEK4Ng6cUpUZnuGbQ&usqp=CAU"
            alt=""
          ></img>
          <p className="bookcard-title">Wings Of Fire</p>
          <p className="bookcard-author">By Pranavdhar</p>
          <div className="bookcard-category"><p>Auto Biography</p></div>

          {user && user.userType === "Student" && (
            <button
              className="purchase-btn"
              onClick={() => handlePurchase("Wings Of Fire")}
            >
              Purchase
            </button>
          )}

          <div className="bookcard-emptybox"></div>
        </div>

        {/* BOOK 2 */}
        <div className="book-card">
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ-Rb2t6jA5ml7n57qdTZbAOWX1qSfsLCbaOA&usqp=CAU"
            alt=""
          ></img>
          <p className="bookcard-title">The Power Of Your Subconscious Mind</p>
          <p className="bookcard-author">By Joseph</p>
          <div className="bookcard-category"><p>Psychology</p></div>

          {user && user.userType === "Student" && (
            <button
              className="purchase-btn"
              onClick={() => handlePurchase("The Power Of Your Subconscious Mind")}
            >
              Purchase
            </button>
          )}

          <div className="bookcard-emptybox"></div>
        </div>

        {/* BOOK 3 */}
        <div className="book-card">
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRRFiDRQ7a-Oo-CnMmnbIMApP1Cq9B5bYx-UA&usqp=CAU"
            alt=""
          ></img>
          <p className="bookcard-title">Elon Musk</p>
          <p className="bookcard-author">By Elon</p>
          <div className="bookcard-category"><p>Auto Biography</p></div>

          {user && user.userType === "Student" && (
            <button
              className="purchase-btn"
              onClick={() => handlePurchase("Elon Musk")}
            >
              Purchase
            </button>
          )}

          <div className="bookcard-emptybox"></div>
        </div>

        {/* BOOK 4 */}
        <div className="book-card">
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ-Rb2t6jA5ml7n57qdTZbAOWX1qSfsLCbaOA&usqp=CAU"
            alt=""
          ></img>
          <p className="bookcard-title">The Subtle Art Of Not Giving A Fuck</p>
          <p className="bookcard-author">By Mark Manson</p>
          <div className="bookcard-category"><p>COMIC</p></div>

          {user && user.userType === "Student" && (
            <button
              className="purchase-btn"
              onClick={() => handlePurchase("The Subtle Art Of Not Giving A Fuck")}
            >
              Purchase
            </button>
          )}

          <div className="bookcard-emptybox"></div>
        </div>

      </div>
    </div>
  );
}

export default Allbooks;
