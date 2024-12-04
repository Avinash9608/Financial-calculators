const mongoose = require("mongoose");

// Define the schema for a record
const recordSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  sales: {
    type: Number,
    required: true,
    min: 0,
  },
  category: {
    type: String,
    required: true,
    enum: ["0-500", "500-1000", "1000-1500", "1500-2000", "2000-2500"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Create a model from the schema
const Record = mongoose.model("Record", recordSchema);

module.exports = Record;
