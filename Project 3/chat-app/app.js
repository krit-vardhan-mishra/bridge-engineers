const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');

// Suppress Mongoose strictQuery warning
mongoose.set('strictQuery', false);

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/chatapp', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

const messageSchema = new mongoose.Schema({
  user: String,
  message: String,
  timestamp: { type: Date, default: Date.now }
});
const Message = mongoose.model('Message', messageSchema);

app.use(express.static('public'));

app.use(express.json());

io.on('connection', (socket) => {
  console.log('New user connected');

  // Fetch and send message history when a user connects
  socket.on('getMessageHistory', async () => {
    const messages = await Message.find().sort({ timestamp: 1 });
    socket.emit('messageHistory', messages);
  });

  socket.on('sendMessage', async (data) => {
    const message = new Message({ user: data.user, message: data.message });
    await message.save();
    io.emit('receiveMessage', { user: data.user, message: data.message, timestamp: message.timestamp });
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});