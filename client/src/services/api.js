import axios from "axios";
import io from "socket.io-client"

const BackendBaseURL = "http://localhost:3000"
const APIBaseURL = "http://localhost:3000/api"

const API = axios.create({
  baseURL: APIBaseURL,

});
// Automatically add auth token if available
API.interceptors.request.use(cfg => {
  const token = localStorage.getItem("token");
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

export const authService = {
  signup: ({ username, password }) =>
    API.post("/auth/signup", { username, password }).then((res) => res.data),

  login: ({ username, password }) =>
    API.post("/auth/login", { username, password }).then((res) => res.data),
};

export const getRooms = () => API.get("/rooms");
export const createRoom = (name) => API.post("/rooms", { name });
export const getRoomMessages = (roomId) => API.get(`/message/${roomId}`);
export const socket = io(BackendBaseURL, { autoConnect: false});
