import express from "express";
import Book from "../models/Book.js";
import BookTransaction from "../models/BookTransaction.js";

const router = express.Router();

/*----------------------------------------------------
 🟦 1. ADMIN: ADD NEW TRANSACTION (Issue / Reserve)
-----------------------------------------------------*/
router.post("/add-transaction", async (req, res) => {
  try {
    if (!req.body.isAdmin) {
      return res.status(403).json("You are not allowed to add a Transaction");
    }

    const newtransaction = new BookTransaction({
      bookId: req.body.bookId,
      borrowerId: req.body.borrowerId,
      bookName: req.body.bookName,
      borrowerName: req.body.borrowerName,
      transactionType: req.body.transactionType, // Issued | Reserved
      fromDate: req.body.fromDate,
      toDate: req.body.toDate,
    });

    const transaction = await newtransaction.save();

    // Attach transaction to the book
    const book = await Book.findById(req.body.bookId);
    if (book) {
      await book.updateOne({ $push: { transactions: transaction._id } });
    }

    res.status(200).json(transaction);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

/*----------------------------------------------------
 🟦 2. STUDENT: PURCHASE A BOOK
-----------------------------------------------------*/
router.post("/purchase", async (req, res) => {
  try {
    const { studentId, bookName } = req.body;

    if (!studentId || !bookName) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const newPurchase = new BookTransaction({
      borrowerId: studentId,
      bookName: bookName,
      transactionType: "purchased",
      fromDate: new Date(),
      toDate: "",
      fine: 0,
    });

    const savedPurchase = await newPurchase.save();
    res.status(200).json(savedPurchase);

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
});

/*----------------------------------------------------
 🟦 3. STUDENT: RETURN BOOK (Issued / Purchased)
-----------------------------------------------------*/
/* RETURN A BOOK */
router.put("/return/:id", async (req, res) => {
  try {
    const tx = await BookTransaction.findById(req.params.id);

    if (!tx) return res.status(404).json({ message: "Transaction not found" });

    tx.transactionType = "Returned";
    tx.returnDate = new Date();

    await tx.save();

    res.status(200).json({ message: "Book returned successfully", tx });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
});


/*----------------------------------------------------
 🟦 4. GET ALL TRANSACTIONS
-----------------------------------------------------*/
router.get("/all-transactions", async (req, res) => {
  try {
    const transactions = await BookTransaction.find({}).sort({ _id: -1 });
    res.status(200).json(transactions);
  } catch (err) {
    res.status(500).json(err);
  }
});

/*----------------------------------------------------
 🟦 5. ADMIN: UPDATE TRANSACTION
-----------------------------------------------------*/
router.put("/update-transaction/:id", async (req, res) => {
  try {
    if (!req.body.isAdmin) {
      return res.status(403).json("Not allowed");
    }

    await BookTransaction.findByIdAndUpdate(req.params.id, {
      $set: req.body,
    });

    res.status(200).json("Transaction updated successfully");

  } catch (err) {
    res.status(500).json(err);
  }
});

/*----------------------------------------------------
 🟦 6. ADMIN: DELETE TRANSACTION
-----------------------------------------------------*/
router.delete("/remove-transaction/:id", async (req, res) => {
  try {
    if (!req.body.isAdmin) {
      return res.status(403).json("You don't have permission to delete");
    }

    const tx = await BookTransaction.findByIdAndDelete(req.params.id);

    if (tx && tx.bookId) {
      const book = await Book.findById(tx.bookId);
      if (book) {
        await book.updateOne({ $pull: { transactions: req.params.id } });
      }
    }

    res.status(200).json("Transaction deleted successfully");

  } catch (err) {
    res.status(500).json(err);
  }
});

export default router;
