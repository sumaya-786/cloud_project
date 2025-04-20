const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');
const port = 3000;

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Serve static files from group-chat-app folder
app.use(express.static(path.join(__dirname, 'group-chat-app')));

// Serve index.html for specific chat room
app.get('/chat/:room', (req, res) => {
  res.sendFile(path.join(__dirname, 'group-chat-app', 'index.html'));
});

// Socket.io logic
io.on('connection', (socket) => {
  console.log('A user connected');
  
  // Join a specific room based on the URL parameter
  socket.on('join-room', (room) => {
    console.log(`User joined room: ${room}`);
    socket.join(room); // Join the room
  });

  // When a message is sent, broadcast to everyone in the chat room
  socket.on('chat-message', (msg) => {
    console.log('Server received:', msg); // Log the message
    // Emit the message to the room (if using rooms) or to everyone
    socket.broadcast.emit('chat-message', msg); // Broadcast to all other clients
    // If using room-specific messaging:
    // io.to(room).emit('chat-message', msg); // If using rooms
  });

  // When user disconnects
  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

// Start server
server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
