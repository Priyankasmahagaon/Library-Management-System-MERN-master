import mongoose from "mongoose";

const TransactionSchema = new mongoose.Schema(
  {
    studentId: {
      type: String,
      required: true
    },
    bookName: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ["purchased", "issued", "returned", "reserved"],
      default: "purchased"
    },
    fromDate: {
      type: Date,
      default: Date.now
    },
    toDate: {
      type: Date,
      default: null
    },
    fine: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

export default mongoose.model("Transaction", TransactionSchema);
