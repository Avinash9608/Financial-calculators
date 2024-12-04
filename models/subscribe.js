const mongoose = require("mongoose");

// Define the schema for subscriptions
const SubscribeSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      "Please enter a valid email address",
    ],
  },
  subscribedAt: {
    type: Date,
    default: Date.now, // Automatically set the subscription date
  },
});

// Create a model using the schema
const Subscribe = mongoose.model("Subscribe", SubscribeSchema);

// Export the model
module.exports = Subscribe;
