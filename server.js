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

    // Join the 'main-game' room
    socket.join('main-game');

    
    // const leaderboard = {
    //     Player1 : 0, 
    //     Player2: 0
    // }

    // leaderboard['main-game'][socket.id] = score;

    // socket.on('getLeaderBoardData', () => {
    //     socket.emit('getLeaderBoard',leaderboard)
    // })
    
    // Check how many players are connected to the game room
    const roomSize = io.sockets.adapter.rooms.get('main-game').size;

    // Notify players about the connection state
    if (roomSize === 1) {
        socket.emit('statusUpdate', 'Waiting for another player to connect...');
    } else if (roomSize === 2) {
        io.in('main-game').emit('statusUpdate', 'Opposite player connected');
    }

    // Handle player joining the game
    socket.on('joinGame', (playerData) => {
        console.log(playerData);
        socket.broadcast.to('main-game').emit('newPlayer', playerData);
    });

    // Handle player disconnect
    socket.on('disconnect', () => {
        console.log('A player disconnected: ' + socket.id);
        socket.broadcast.to('main-game').emit('statusUpdate', 'A player has disconnected');
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
