import { useState, useEffect } from "react";
import { getRooms, createRoom, getRoomMessages, socket } from "../services/api"
import ChatRoom from "../components/ChatRoom"

export default function Home({ user }) {
    const [rooms, setRooms] = useState([]);
    const [currentRoom, setCurrentRoom] = useState(null);
    const [messages, setMessages] = useState([]);


    useEffect(() => {
        fetchRooms();
        socket.connect();
        return () => socket.disconnect();
    }, []);

    const fetchRooms = async () => {
        const res = await getRooms();
        setRooms(res.data);
    };
    const handleJoinRoom = async () => {
        socket.removeAllListeners("joinRoom", { username: user.username,roomId:- rooms._id })
    }
    }