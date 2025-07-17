const express = require("express");
const router = express.Router();
const { getRoomMessages } = require("../controllers/messageController");

// Remove protect() for now if token not sent from frontend
router.get("/:roomId", getRoomMessages);

module.exports = router;
