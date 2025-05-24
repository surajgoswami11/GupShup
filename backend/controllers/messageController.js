const Message = require("../models/messageModel");
const User = require("../models/userModel");

exports.getUserForSidebar = async (req, res) => {
  try {
    const loggedUserId = req.user._id;
    const filteredUser = await User.find({ _id: { $ne: loggedUserId } }).select(
      "-password"
    );
    res.status(200).json(filteredUser);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getMessage = async (req, res) => {
  try {
    const reciverId = req.params.id;
    const senderId = req.user._id;

    const message = await Message.find({
      $or: [
        {
          senderId: senderId,
          reciverId: reciverId,
        },
        {
          reciverId: senderId,
          senderId: reciverId,
        },
      ],
    });
    res.status(200).json(message);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.sendMessage = async (req, res) => {
  try {
    const senderId = req.user._id;
    const reciverId = req.params.id;
    const { image, text } = req.body;

    let imageUrl;

    if (image) {
      const uploadImage = await cloudinary.uploader.upload(image);
      imageUrl = uploadImage.secure_url;
    }
    const newMessage = await Message.create({
      senderId,
      reciverId,
      text,
      image: imageUrl,
    });
    res.status(200).json(newMessage);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};
