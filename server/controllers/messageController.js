const Message = require("../models/Message");

exports.getRoomMessages = async (req, res)=> {
    const messages = await Message.find ({ room: req.params.roomid })
    .populate('sender', 'username')
    .sort({ createdAt: 1 })
}