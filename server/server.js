const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db'); // fixed path
const path = require('path');

// Load environment variables
dotenv.config();
// Connect to DB
connectDB();
// Initialize Express app
const app = express();
const server = http.createServer(app);
// Socket.io setup
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});
// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/rooms", require("./routes/room"));
app.use("/api/messages", require("./routes/message"));

// Root route
app.get('/', (req, res) => {
  res.send('Socket.io Chat Server is running');
});

// Socket.io Logic (modularized)
require('./socket')(io);

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});

module.exports = { app, server, io };
