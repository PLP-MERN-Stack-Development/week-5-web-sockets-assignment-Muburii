const Message = require("../models/Message");

exports.getRoomMessages = async (req, res) => {
  try {
    const messages = await Message.find({ room: req.params.roomId }) // updated param
      .populate('sender', 'username')
      .sort({ createdAt: 1 });

    res.json({ success: true, messages });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
