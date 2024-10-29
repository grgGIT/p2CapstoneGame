const socket = io();
let player1 = { name: '', score: 0 };
let player2 = { name: '', score: 0 };
let currentPlayer = 1; // To track whose turn it is
let playerName = '';
let playerIcon = ''; // This will store the captured photo or the random color
let playerColor = '';

// Handle status updates (connection messages)
socket.on('statusUpdate', (message) => {
    document.getElementById('status').textContent = message;
});
// socket.on('playerJoined', (data) => {
//     if (!player1.name) {
//         player1.name = data.name;
//         player1.image = data.icon; // Assume you handle playerIcon
//     } else {
//         player2.name = data.name;
//         player2.image = data.icon; // Assume you handle playerIcon
//     }
// });

// Listen for square clicks from the server
socket.on('updateScores', (data) => {
    player1.score = data.player1Score;
    player2.score = data.player2Score;
    updateScoreboard();
});

function updateScoreboard() {
    document.getElementById('player1').textContent = `${player1.name}: ${player1.score}`;
    document.getElementById('player2').textContent = `${player2.name}: ${player2.score}`;
}

// Handle leaderboard data
socket.on('getLeaderBoard', (leaderboard) => {
    // Update your scoreboard display here
    console.log('Leaderboard data received:', leaderboard);
    // Example: Update UI to show leaderboard
    document.getElementById('leaderboard').innerHTML = `
        <li>${leaderboard.Player1.name}: ${leaderboard.Player1.score}</li>
        <li>${leaderboard.Player2.name}: ${leaderboard.Player2.score}</li>
    `;
});




// Photo capture setup
document.getElementById('capturePhoto').addEventListener('click', () => {
    const video = document.createElement('video');
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    const captureButton = document.createElement('button');
    captureButton.textContent = "Take Photo";
    const skipButton = document.createElement('button');
    skipButton.textContent = "Skip Photo";

    // Show video stream to user
    document.body.appendChild(video);
    document.body.appendChild(captureButton);
    document.body.appendChild(skipButton);

    navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
        video.srcObject = stream;
        video.play();
    }).catch((err) => {
        console.error("Error accessing the camera: ", err);
    });

    // Capture the image when button clicked
    captureButton.addEventListener('click', () => {
        // Set canvas size to video size and draw image from video
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Convert canvas to data URL (image)
        playerIcon = canvas.toDataURL();  // This will store the photo
        console.log("Photo captured!!");

        // Cleanup: stop the video stream and remove video elements
        const tracks = video.srcObject.getTracks();
        tracks.forEach(track => track.stop()); // Stop the camera stream
        video.remove();
        captureButton.remove();
        skipButton.remove();

        alert("Photo captured successfully!");
    });


    // Skip the photo and assign random color
    skipButton.addEventListener('click', () => {
        playerColor = '#' + Math.floor(Math.random() * 16777215).toString(16);
        playerIcon = playerColor; // Use the color as the icon
        console.log('Random color assigned: ' + playerColor);

        // Cleanup video stream
        const tracks = video.srcObject.getTracks();
        tracks.forEach(track => track.stop());
        video.remove();
        captureButton.remove();
        skipButton.remove();

        alert("Photo skipped, random color assigned!");
    });
});

// Skip button for moving to game screen
document.getElementById('continue').addEventListener('click', () => {
    if (!playerIcon) {
        alert('Please capture a photo or skip to continue.');
    }else if (playerName.length < 3) {
        alert('Please enter a 3-character name.');
    }
     else {
        document.getElementById('startScreen').classList.add('hidden');
        document.getElementById('gameScreen').classList.remove('hidden');

        if (currentPlayer === 1) {
            player1.name = playerName;
            player1.icon = playerIcon;
        } else {
            player2.name = playerName;
            player2.icon = playerIcon;
        }
        socket.emit('joinGame', { name: playerName, icon: playerIcon, color: playerColor });
        startGame();
    }
});

// Name input validation
document.getElementById('playerInitials').addEventListener('input', (event) => {
    playerName = event.target.value;
});

// Start game function with timer and canvas display
function startGame() {
    const gameArea = document.getElementById('gameArea');
    const gameCanvas = document.createElement('div');
    gameArea.appendChild(gameCanvas);
    new p5(sketch, gameCanvas);

}


document.getElementById('endGameBtn').addEventListener('click', () => {
    socket.emit('endGame'); // Notify server to finalize game
    document.getElementById('gameScreen').classList.add('hidden');
    document.getElementById('resultsScreen').classList.remove('hidden');
    document.getElementById('finalScores').textContent = `${player1.name}: ${player1.score} | ${player2.name}: ${player2.score}`
    // Update scoreboard with current scores
});




// Update player list on connection
socket.on('newPlayer', (playerData) => {
    console.log(`${playerData.name} has joined the game.`);
});




    