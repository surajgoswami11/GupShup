const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unqiue: true,
  },
  password: {
    type: String,
    required: true,
    trim: true,
  },
  profilePic: {
    type: String,
    default: "",
  },
});

module.exports = mongoose.model("User", userSchema);
