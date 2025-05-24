const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  reciverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  text: {
    type: String,
  },
  image: {
    type: String,
  },
});

module.exports = mongoose.model("Message", messageSchema);
