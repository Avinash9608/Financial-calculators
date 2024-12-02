const mongoose = require("mongoose");

// Define a schema for storing emails and queries
const connectingSchema = new mongoose.Schema({
  email: String,
  message: String,
});

module.exports = mongoose.model("contactingform", connectingSchema);
