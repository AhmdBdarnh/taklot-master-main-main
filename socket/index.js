const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);

// Setup socket.io to work with our server with CORS allowed for the client origin
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:8000", // Adjusted to reflect the new port if changed
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Serve a simple test route
app.get('/', (req, res) => {
  res.send('<h1>Hello world</h1>');
});

let onlineUsers = [];

const addNewUser = (userId, socketId) => {
  !onlineUsers.some(user => user.userId === userId) && 
  onlineUsers.push({ userId, socketId });
};

const removeUser = (socketId) => {
  onlineUsers = onlineUsers.filter((user) => user.socketId !== socketId);
};

const getUserSocketId = (userId) => {
  const user = onlineUsers.find(user => user.userId === userId);
  return user ? user.socketId : null;
};

io.on('connection', (socket) => {
  console.log('A user connected, Socket ID:', socket.id);
  console.log(onlineUsers);

  socket.on('registerUser', (userId) => {
    addNewUser(userId, socket.id);
    console.log(`New user registered: ${userId} with socket ID: ${socket.id}`);
  });

  socket.on("disconnect", () => {
    removeUser(socket.id);
    console.log(`User disconnected: Socket ID ${socket.id}`);
  });
});

const detectPort = require('detect-port');

// Automatically select a different port if the default one is in use
const PORT =  3000;
detectPort(PORT, (err, _port) => {
  if (err) {
    console.log('Error detecting port:', err);
    return;
  }
  
  if (PORT !== _port) {
    console.warn(`Port ${PORT} was in use. Server started on port ${_port} instead.`);
  }
  
  server.listen(_port, () => {
    console.log(`Server running on port ${_port}`);
  });
});


module.exports = {
  getUserSocketId,
  getOnlineUsers: () => onlineUsers, // Export a function that returns the current state
  io
};

