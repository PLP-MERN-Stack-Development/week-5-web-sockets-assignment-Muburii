import axios from "axios";
import io from "socket.io-client";

const BackendBaseURL = "http://localhost:3000";
const APIBaseURL = "http://localhost:3000/api";

const API = axios.create({ baseURL: APIBaseURL });

API.interceptors.request.use(cfg => {
  const token = localStorage.getItem("token");
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

// Export login and signup directly
export const login = ({ username, password }) =>
  API.post("/auth/login", { username, password }).then((res) => res.data);

export const signup = ({ username, password }) =>
  API.post("/auth/signup", { username, password }).then((res) => res.data);

// Optionally export authService object too
export const authService = { login, signup };

// Rooms and messages
export const getRooms = () => API.get("/rooms");
export const createRoom = (name) => API.post("/rooms", { name });
export const getRoomMessages = (roomId) => API.get(`/messages/${roomId}`);


// Socket export
export const socket = io(BackendBaseURL, { autoConnect: false });

// Axios instance (if needed elsewhere)
export default API;
