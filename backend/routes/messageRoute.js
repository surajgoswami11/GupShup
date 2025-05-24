const express = require("express");
const {
  getUserForSidebar,
  getMessage,
  sendMessage,
} = require("../controllers/messageController");
const { protectRoute } = require("../middlewares/authMiddleWare");

const router = express.Router();

router.get("/users", protectRoute, getUserForSidebar);
router.get("/messages/:id", protectRoute, getMessage);
router.post("/:id", protectRoute, sendMessage);

module.exports = router;
