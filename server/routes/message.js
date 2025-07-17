const express = require("express");
const router = express.Router();
const { getRoomMessages } = require("../controllers/messageController");
const { protect } = require("../middleware/auth");

router.get('/:roomId', protect, getRoomMessages);

module.exports = router;
