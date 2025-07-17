# 🔄 Week 5: Real-Time Communication with Socket.io

## 🚀 Objective
Build a real-time chat application using Socket.io that demonstrates bidirectional communication between clients and server, implementing features like live messaging, notifications, and online status updates.

## 📂 Tasks

### Task 1: Project Setup
- Set up a Node.js server with Express
- Configure Socket.io on the server side
- Create a React front-end application
- Set up Socket.io client in the React app
- Establish a basic connection between client and server

### Task 2: Core Chat Functionality
- Implement user authentication (simple username-based or JWT)
- Create a global chat room where all users can send and receive messages
- Display messages with sender's name and timestamp
- Show typing indicators when a user is composing a message
- Implement online/offline status for users

### Task 3: Advanced Chat Features
- Create private messaging between users
- Implement multiple chat rooms or channels
- Add "user is typing" indicator
- Enable file or image sharing
- Implement read receipts for messages
- Add message reactions (like, love, etc.)

### Task 4: Real-Time Notifications
- Send notifications when a user receives a new message
- Notify when a user joins or leaves a chat room
- Display unread message count
- Implement sound notifications for new messages
- Add browser notifications (using the Web Notifications API)

### Task 5: Performance and UX Optimization
- Implement message pagination for loading older messages
- Add reconnection logic for handling disconnections
- Optimize Socket.io for performance (using namespaces, rooms)
- Implement message delivery acknowledgment
- Add message search functionality
- Ensure the application works well on both desktop and mobile devices

## 🧪 Expected Outcome
- A fully functional real-time chat application
- Smooth bidirectional communication using Socket.io
- Good user experience with proper error handling and loading states
- Implementation of at least 3 advanced chat features
- Responsive design that works on different devices

## 🛠️ Setup
1. Make sure you have Node.js installed (v18+ recommended)
2. Clone the starter code repository
3. Install server dependencies:
   ```
   cd server
   npm install
   ```
4. Install client dependencies:
   ```
   cd client
   npm install
   ```
5. Start the development servers:
   ```
   # In the server directory
   npm run dev
   
   # In the client directory
   npm run dev
   ```

## ✅ Submission Instructions
1. Accept the GitHub Classroom assignment invitation
2. Clone your personal repository that was created by GitHub Classroom
3. Complete all the tasks in the assignment
4. Commit and push your code regularly to show progress
5. Include in your repository:
   - Complete client and server code
   - A comprehensive README.md with:
     - Project overview
     - Setup instructions
     - Features implemented
     - Screenshots or GIFs of the application
6. Optional: Deploy your application
   - Deploy the server to a service like Render, Railway, or Heroku
   - Deploy the client to Vercel, Netlify, or GitHub Pages
   - Add the deployed URLs to your README.md
7. Your submission will be automatically graded based on the criteria in the autograding configuration
8. The instructor will review your submission after the autograding is complete 







// socket.js - Socket.io client setup

import { io } from 'socket.io-client';
import { useEffect, useState } from 'react';

// Socket.io connection URL
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

// Create socket instance
export const socket = io(SOCKET_URL, {
  autoConnect: false,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});

// Custom hook for using socket.io
export const useSocket = () => {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [lastMessage, setLastMessage] = useState(null);
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [typingUsers, setTypingUsers] = useState([]);

  // Connect to socket server
  const connect = (username) => {
    socket.connect();
    if (username) {
      socket.emit('user_join', username);
    }
  };

  // Disconnect from socket server
  const disconnect = () => {
    socket.disconnect();
  };

  // Send a message
  const sendMessage = (message) => {
    socket.emit('send_message', { message });
  };

  // Send a private message
  const sendPrivateMessage = (to, message) => {
    socket.emit('private_message', { to, message });
  };

  // Set typing status
  const setTyping = (isTyping) => {
    socket.emit('typing', isTyping);
  };

  // Socket event listeners
  useEffect(() => {
    // Connection events
    const onConnect = () => {
      setIsConnected(true);
    };

    const onDisconnect = () => {
      setIsConnected(false);
    };

    // Message events
    const onReceiveMessage = (message) => {
      setLastMessage(message);
      setMessages((prev) => [...prev, message]);
    };

    const onPrivateMessage = (message) => {
      setLastMessage(message);
      setMessages((prev) => [...prev, message]);
    };

    // User events
    const onUserList = (userList) => {
      setUsers(userList);
    };

    const onUserJoined = (user) => {
      // You could add a system message here
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          system: true,
          message: `${user.username} joined the chat`,
          timestamp: new Date().toISOString(),
        },
      ]);
    };

    const onUserLeft = (user) => {
      // You could add a system message here
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          system: true,
          message: `${user.username} left the chat`,
          timestamp: new Date().toISOString(),
        },
      ]);
    };

    // Typing events
    const onTypingUsers = (users) => {
      setTypingUsers(users);
    };

    // Register event listeners
    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('receive_message', onReceiveMessage);
    socket.on('private_message', onPrivateMessage);
    socket.on('user_list', onUserList);
    socket.on('user_joined', onUserJoined);
    socket.on('user_left', onUserLeft);
    socket.on('typing_users', onTypingUsers);

    // Clean up event listeners
    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('receive_message', onReceiveMessage);
      socket.off('private_message', onPrivateMessage);
      socket.off('user_list', onUserList);
      socket.off('user_joined', onUserJoined);
      socket.off('user_left', onUserLeft);
      socket.off('typing_users', onTypingUsers);
    };
  }, []);

  return {
    socket,
    isConnected,
    lastMessage,
    messages,
    users,
    typingUsers,
    connect,
    disconnect,
    sendMessage,
    sendPrivateMessage,
    setTyping,
  };
};

export default socket; 