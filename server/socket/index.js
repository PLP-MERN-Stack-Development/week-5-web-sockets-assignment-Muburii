const Message = require('../models/Message');
const User = require('../models/User');

module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log("Socket Connected:", socket.id);

    socket.on("joinRoom", async ({ username, roomId }) => {
      const user = await User.findOneAndUpdate(
        { username },
        { socketId: socket.id, isOnline: true },
        { new: true, upsert: true }
      );

      socket.join(roomId);
      io.to(roomId).emit("userJoined", { user, roomId });

      socket.on("typing", () => {
        socket.to(roomId).emit("typing", username);
      });

      socket.on("stopTyping", () => {
        socket.to(roomId).emit("stopTyping", username);
      });

      socket.on("sendMessage", async (data) => {
        try {
          // Ensure 'data.content' exists and is a string
          if (typeof data.content !== 'string') {
            console.error("Invalid message content:", data);
            return;
          }

          const message = await Message.create({
            sender: user._id,
            room: roomId,
            content: data.content, // ✅ Only use the string
          });

          const fullMessage = await message.populate("sender", "username");
          io.to(roomId).emit("newMessage", fullMessage);
        } catch (error) {
          console.error("Error sending message:", error.message);
        }
      });

      socket.on("disconnect", async () => {
        const offlineUser = await User.findOneAndUpdate(
          { socketId: socket.id },
          { isOnline: false },
          { new: true }
        );
        if (offlineUser) {
          io.emit("userOffline", offlineUser.username);
        }
      });
    });
  });
};
