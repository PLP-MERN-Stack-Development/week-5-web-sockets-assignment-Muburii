import { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";

export default function ChatRoom({ room, messages: initialMessages, user, socket }) {
  const [messages, setMessages] = useState(initialMessages || []);
  const [chat, setChat] = useState("");
  const [typingUser, setTypingUser] = useState("");
  const msgRef = useRef(null);

  useEffect(() => {
    setMessages(initialMessages || []);
  }, [initialMessages]);

  useEffect(() => {
    const handleNewMessage = (msg) => {
      setMessages((prev) => [...prev, msg]);
      msgRef.current?.scrollTo({ top: msgRef.current.scrollHeight, behavior: "smooth" });
    };

    socket.on("newMessage", handleNewMessage);
    socket.on("typing", (username) => setTypingUser(username));
    socket.on("stopTyping", () => setTypingUser(""));

    return () => {
      socket.off("newMessage", handleNewMessage);
      socket.off("typing");
      socket.off("stopTyping");
    };
  }, [socket]);

  const handleTyping = () => {
    socket.emit("typing", user.username);
    setTimeout(() => socket.emit("stopTyping"), 1000);
  };

  const handleSend = () => {
    if (!chat.trim()) return;

    socket.emit("sendMessage", {
      content: chat,
      roomId: room._id,
      sender: { username: user.username }, // Not necessary if handled on backend
    });

    setChat("");
  };

  return (
    <div className="flex flex-col h-full">
      <h2 className="text-2xl font-bold mb-4">{room.name}</h2>

      <div
        ref={msgRef}
        className="flex-1 overflow-y-auto border p-4 mb-2 rounded bg-gray-100"
      >
        {messages.length > 0 ? (
          messages.map((msg) => (
            <p key={msg._id || Math.random()} className="mb-1">
              <strong>{msg.sender?.username || "Unknown"}:</strong> {msg.content}
            </p>
          ))
        ) : (
          <p className="text-gray-500 italic">No messages to display.</p>
        )}
      </div>

      {typingUser && (
        <p className="text-sm text-gray-500 mb-1">{typingUser} is typing...</p>
      )}

      <div className="flex">
        <input
          type="text"
          className="flex-1 border p-2 rounded-l"
          placeholder="Type your message..."
          value={chat}
          onChange={(e) => setChat(e.target.value)}
          onKeyDown={handleTyping}
        />
        <button
          onClick={handleSend}
          className="bg-blue-600 text-white px-4 rounded-r hover:bg-blue-700"
        >
          Send
        </button>
      </div>
    </div>
  );
}

ChatRoom.propTypes = {
  room: PropTypes.object.isRequired,
  messages: PropTypes.array.isRequired,
  user: PropTypes.object.isRequired,
  socket: PropTypes.object.isRequired,
};
