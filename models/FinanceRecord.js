// models/FinanceRecord.js
const mongoose = require("mongoose");

const financeRecordSchema = new mongoose.Schema({
  type: { type: String, required: true }, // 'Income', 'Expense', etc.
  description: String,
  amount: { type: Number, required: true },
  date: { type: Date, required: true },
});

const FinanceRecord = mongoose.model("FinanceRecord", financeRecordSchema);
module.exports = FinanceRecord;
