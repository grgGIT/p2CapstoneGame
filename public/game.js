let player1 = { name: '', score: 0, image: '' };
let player2 = { name: '', score: 0, image: '' };
let currentPlayer = 1;
let gameActive = false;
let timer;
let timeLeft = 120; // 2 minutes
const targetArea = document.getElementById('targetArea');
const player1ScoreDisplay = document.getElementById('player1Score');
const player2ScoreDisplay = document.getElementById('player2Score');
const currentPlayerNameDisplay = document.getElementById('currentPlayerName');
const currentPlayerImage = document.getElementById('currentPlayerImage');
const currentScoreDisplay = document.getElementById('currentScore');
const timeLeftDisplay = document.getElementById('timeLeft');
const startGameBtn = document.getElementById('startGameBtn');
const endGameBtn = document.getElementById('endGameBtn');
const resultDiv = document.getElementById('result');
const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const capturedImage = document.getElementById('capturedImage');
const acceptPictureBtn = document.getElementById('acceptPictureBtn');
const takePictureBtn = document.getElementById('takePictureBtn');
const retakeBtn = document.getElementById('retakeBtn');
const player1Image = document.getElementById('player1Image');
const player2Image = document.getElementById('player2Image');
const waitingScreen = document.getElementById('waiting');

// Start Game
startGameBtn.addEventListener('click', () => {
    const initials = document.getElementById('playerInitials').value.toUpperCase();
    if (initials.length === 3) {
        player1.name = initials;
        document.getElementById('startScreen').classList.add('hidden');
        document.getElementById('photoCapture').classList.remove('hidden');
    }
});

// Take Picture
takePictureBtn.addEventListener('click', takePicture);

// Accept Picture
acceptPictureBtn.addEventListener('click', () => {
    player1.image = capturedImage.src;
    player1Image.src = player1.image;
    document.getElementById('photoCapture').classList.add('hidden');
    currentPlayerNameDisplay.textContent = player1.name;
    currentPlayerImage.src = player1.image;
    startGame();
});

// Retake Picture
retakeBtn.addEventListener('click', takePicture);

// Start the Game
function startGame() {
    gameActive = true;
    createTarget();
    timer = setInterval(updateTimer, 1000);
    waitingScreen.classList.add('hidden'); // Hide waiting screen if visible
}

// Create Target
function createTarget() {
    const target = document.createElement('div');
    target.classList.add('target');
    target.style.top = `${Math.random() * (targetArea.offsetHeight - 50)}px`;
    target.style.left = `${Math.random() * (targetArea.offsetWidth - 50)}px`;
    target.addEventListener('click', () => targetHit(target));
    targetArea.appendChild(target);
}

// Target Hit
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

    // Switch players
    if (currentPlayer === 1) {
        currentPlayer = 2;
        currentPlayerNameDisplay.textContent = player2.name;
        currentPlayerImage.src = player2.image;
    } else {
        currentPlayer = 1;
        currentPlayerNameDisplay.textContent = player1.name;
        currentPlayerImage.src = player1.image;
        takePicture(); // Prompt for player 2's picture
    }
}

// Take Picture from Video
function takePicture() {
    video.classList.remove('hidden');
    takePictureBtn.classList.remove('hidden');
    acceptPictureBtn.classList.add('hidden');
    retakeBtn.classList.add('hidden');

    navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
            video.srcObject = stream;
        })
        .catch(err => {
            console.error("Error accessing camera: " + err);
        });
}

// Capture Image
function captureImage() {
    const context = canvas.getContext('2d');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    const imageDataUrl = canvas.toDataURL('image/png');
    capturedImage.src = imageDataUrl;

    video.classList.add('hidden');
    capturedImage.classList.remove('hidden');
    acceptPictureBtn.classList.remove('hidden');
    retakeBtn.classList.remove('hidden');
}

// Update Timer
function updateTimer() {
    timeLeft--;
    timeLeftDisplay.textContent = timeLeft;
    if (timeLeft <= 0) {
        clearInterval(timer);
        endTurn();
    }
}

// End Turn
function endTurn() {
    gameActive = false;
    resultDiv.textContent = `Turn ended! Player 1 Score: ${player1.score}, Player 2 Score: ${player2.score}`;
    resultDiv.classList.remove('hidden');
    endGameBtn.classList.remove('hidden');
}

// End Game
endGameBtn.addEventListener('click', () => {
    clearInterval(timer);
    document.getElementById('scoreboard').classList.remove('hidden');
    player1NameDisplay.textContent = player1.name;
    player2NameDisplay.textContent = player2.name;
    player1ScoreDisplay.textContent = player1.score;
    player2ScoreDisplay.textContent = player2.score;
});

// Handle User Media Stream
takePictureBtn.addEventListener('click', captureImage);

const socket = io();

// Example event for joining the game
document.getElementById('start-game').addEventListener('click', () => {
    const playerData = {
        name: prompt('Enter your name:'),
        score: 0,
    };
    socket.emit('joinGame', playerData);
});

// Add your game logic here...
