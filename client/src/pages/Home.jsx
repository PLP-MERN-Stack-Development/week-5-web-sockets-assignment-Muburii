import { useState, useEffect } from "react";
import { getRooms, getRoomMessages, socket } from "../services/api";
import ChatRoom from "../components/ChatRoom";

export default function Home({ user }) {
  const [rooms, setRooms] = useState([]);
  const [currentRoom, setCurrentRoom] = useState(null);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    fetchRooms();

    // Only connect once
    if (!socket.connected) {
      socket.connect();
    }

    return () => {
      socket.disconnect();
    };
  }, []);

  const fetchRooms = async () => {
    try {
      const res = await getRooms();
      setRooms(res.data);
    } catch (err) {
      console.error("Failed to fetch rooms:", err);
    }
  };

  const handleJoinRoom = async (room) => {
    try {
      // Leave previous room
      if (currentRoom) {
        socket.emit("leaveRoom", currentRoom._id);
      }

      socket.emit("joinRoom", {
        username: user.username,
        roomId: room._id,
      });

      setCurrentRoom(room);

      const res = await getRoomMessages(room._id); // Ensure token is sent if route is protected
      setMessages(res.data);
    } catch (err) {
      console.error("Failed to join room:", err);
    }
  };

  return (
    <div className="flex h-screen">
      <aside className="w-1/4 bg-gray-800 text-white p-4">
        <h2 className="text-lg mb-4">Rooms</h2>
        <ul className="space-y-2">
          {rooms.map((room) => (
            <li key={room._id}>
              <button
                onClick={() => handleJoinRoom(room)}
                className="w-full bg-gray-700 p-2 rounded hover:bg-gray-600"
              >
                {room.name}
              </button>
            </li>
          ))}
        </ul>
      </aside>

      <main className="flex-1 p-4">
        {currentRoom ? (
          <ChatRoom
            room={currentRoom}
            messages={messages}
            user={user}
            socket={socket}
          />
        ) : (
          <p>Select a room to join</p>
        )}
      </main>
    </div>
  );
}
