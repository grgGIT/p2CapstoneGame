const socket = io();
let playerName = '';
let playerIcon = ''; // This will store the captured photo or the random color
let playerColor = '';

// Handle status updates (connection messages)
socket.on('statusUpdate', (message) => {
    document.getElementById('status').textContent = message;
});

// const init = () =>{
    
//     socket.on('getLeaderBoardData', (data) => {})
//     socket.emit('getLeaderBoardData', 'test')
// }


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
    } else {
        document.getElementById('startScreen').classList.add('hidden');
        document.getElementById('gameScreen').classList.remove('hidden');
        startGame();
    }
});

// Name input validation
document.getElementById('playerInitials').addEventListener('input', (event) => {
    playerName = event.target.value;
});

// Start game function with timer and canvas display
function startGame() {
    socket.emit('joinGame', { name: playerName || 'Player', icon: playerIcon, color: playerColor });

    // // Show game canvas (replace with actual game logic later)
    const gameArea = document.getElementById('gameArea');
    const gameCanvas = document.createElement('div');
    gameArea.appendChild(gameCanvas);
    
    new p5(sketch, gameCanvas);

}

function getRandomColorIcon() {
    const colors = ['red', 'green', 'blue', 'yellow', 'purple', 'orange'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    const canvas = document.createElement('canvas');
    canvas.width = 50;
    canvas.height = 50;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = randomColor;
    ctx.beginPath();
    ctx.arc(25, 25, 25, 0, Math.PI * 2);
    ctx.fill();
    return canvas.toDataURL('image/png');
}
acceptPictureBtn.addEventListener('click', () => {
    if (capturedImage.src) {
        if (currentPlayer === 1) {
            player1.image = capturedImage.src;
        } else {
            player2.image = capturedImage.src;
        }
    } else {
        // If the player doesn't take a picture, assign a random color icon
        if (currentPlayer === 1) {
            player1.image = getRandomColorIcon();
        } else {
            player2.image = getRandomColorIcon();
        }
    }
    
    currentPlayerImage.src = currentPlayer === 1 ? player1.image : player2.image;
    document.getElementById('photoCapture').classList.add('hidden');
    startGame();
});
endGameBtn.addEventListener('click', () => {
    clearInterval(timer);
    document.getElementById('scoreboard').classList.remove('hidden');
    
    player1NameDisplay.textContent = player1.name;
    player2NameDisplay.textContent = player2.name;

    player1ScoreDisplay.textContent = player1.score;
    player2ScoreDisplay.textContent = player2.score;
function targetHit(target) {
    if (!gameActive) return;

    // Increment score for the current player
    if (currentPlayer === 1) {
        player1.score++;
        player1ScoreDisplay.textContent = player1.score;
    } else {
        player2.score++;
        player2ScoreDisplay.textContent = player2.score;
    }

    // Remove the target and create a new one
    targetArea.removeChild(target);
    createTarget();

    // Switch players (if it's a multiplayer game, adjust switching logic as needed)
    if (currentPlayer === 1) {
        currentPlayer = 2;
        currentPlayerNameDisplay.textContent = player2.name;
        currentPlayerImage.src = player2.image || getRandomColorIcon();
    } else {
        currentPlayer = 1;
        currentPlayerNameDisplay.textContent = player1.name;
        currentPlayerImage.src = player1.image || getRandomColorIcon();
    }
}    player1Image.src = player1.image;
    player2Image.src = player2.image;
});


// Display final results
function showResults() {
    document.getElementById('gameScreen').classList.add('hidden');
    document.getElementById('resultsScreen').classList.remove('hidden');
    document.getElementById('finalScores').textContent = `Final Score: ${playerScore}`;
}

// Update player list on connection
socket.on('newPlayer', (playerData) => {
    console.log(`${playerData.name} has joined the game.`);
});


// socket.emit('joinGame', { name: playerName || 'Player', icon: playerIcon, color: playerColor });

    // // Show game canvas (replace with actual game logic later)
    // const canvas = document.createElement('canvas');
    // const context = canvas.getContext('2d');
    // canvas.width = 800;
    // canvas.height = 400;
    // document.getElementById('gameArea').appendChild(canvas);

    // let timer = 60;
    // const interval = setInterval(() => {
    //     document.getElementById('timer').textContent = timer;
    //     timer--;

    //     // Example canvas game logic - this is where your game goes!
    //     context.clearRect(0, 0, canvas.width, canvas.height);

    //      // Draw a random box on the canvas
    //      const boxX = Math.random() * (canvas.width - 50);
    //      const boxY = Math.random() * (canvas.height - 50);
    //      context.fillStyle = playerColor || '#000';
    //      context.fillRect(boxX, boxY, 50, 50);
 
    //      // Detect box clicks and increase score
    //      canvas.addEventListener('click', (event) => {
    //          const rect = canvas.getBoundingClientRect();
    //          const x = event.clientX - rect.left;
    //          const y = event.clientY - rect.top;
 
    //          if (x >= boxX && x <= boxX + 50 && y >= boxY && y <= boxY + 50) {
    //              playerScore++;
    //              document.getElementById('scoreboard').textContent = `Score: ${playerScore}`;
    //              console.log('Box clicked! Score: ' + playerScore);
    //          }
    //      });
 
    //      if (timer < 0) {
    //          clearInterval(interval);
    //          showResults();
    //      }
    //  }, 1000);


    