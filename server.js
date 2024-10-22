const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static(path.join(__dirname, 'public'))); // Serve static files

// Handle player connections
io.on('connection', (socket) => {
    console.log('A player connected: ' + socket.id);

    // Handle player joining
    socket.on('joinGame', (playerData) => {
        // Store player data and notify other players
        console.log(playerData);
        socket.broadcast.emit('newPlayer', playerData);
    });

    // Handle player disconnect
    socket.on('disconnect', () => {
        console.log('A player disconnected: ' + socket.id);
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
