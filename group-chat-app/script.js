const socket = io();
const chat = document.getElementById('chat');
const messageForm = document.getElementById('messageForm');
const messageInput = document.getElementById('messageInput');

// Extract room from URL
const room = window.location.pathname.split('/').pop();

// Join the room
socket.emit('join-room', room);

// Send message
messageForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const msg = messageInput.value.trim();
  if (msg) {
    appendMessage(msg, 'me');
    socket.emit('chat-message', msg);
    messageInput.value = '';
  }
});

socket.on('chat-message', (msg) => {
    appendMessage(msg, 'other'); // Append message as 'other' (for others)
  });
  
  // Append message to chat with styling based on the sender
  function appendMessage(msg, sender) {
    const messageElement = document.createElement('div');
    messageElement.textContent = msg; // Set the message text
    
    if (sender === 'me') {
      messageElement.classList.add('my-message'); // Add class for sender's message
    } else {
      messageElement.classList.add('other-message'); // Add class for others' message
    }
    
    chat.appendChild(messageElement); // Append message to chat
    chat.scrollTop = chat.scrollHeight; // Scroll to the bottom of the chat window
  }