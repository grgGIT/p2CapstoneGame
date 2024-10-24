let sketch = function(p) {
  let squares = [];
  let explosions = [];
  let score = 0;
  let gameTime = 30; // Game duration in seconds
  let gameOver = false;
  let startTime;
  let targetImg, explosionGif;

  p.preload = function() {
    // Load the target image and explosion gif
    targetImg = p.loadImage('targ.png');
    explosionGif = p.loadImage('xpl.gif');
  };

  p.setup = function() {
    p.createCanvas(800, 600);
    startTime = p.millis(); // Track the starting time

    // Generate initial squares
    for (let i = 0; i < 5; i++) {
      squares.push(new MovingSquare(p.random(50, 150), p.random(50, 150), p.random(2, 5), p.random(2, 5)));
    }
  };

  p.draw = function() {
    p.background(135, 206, 235); // Sky blue background

    let hovering = false;
    // Timer logic
    let elapsedTime = (p.millis() - startTime) / 1000;
    let timeLeft = gameTime - elapsedTime;

    if (timeLeft <= 0) {
      gameOver = true;
      timeLeft = 0;
    }

    // Display score and timer
    p.fill(0);
    p.textSize(32);
    p.text("Score: " + score, 10, 40);
    p.text("Time Left: " + p.nf(timeLeft.toFixed(1), 2), 10, 80);

    // Check if game over
    if (gameOver) {
      p.textSize(64);
      p.text("Game Over!", p.width / 2 - 160, p.height / 2);
      return;
    }

    // Move and display squares
    for (let i = squares.length - 1; i >= 0; i--) {
      squares[i].move();
      squares[i].display();

      if (squares[i].clicked()) {
        hovering = true; // Mouse is over a square
      }
    }

    // Handle explosion animations
    for (let i = explosions.length - 1; i >= 0; i--) {
      explosions[i].animate();
      if (explosions[i].finished()) {
        explosions.splice(i, 1); // Remove the explosion after it's done
      }
    }

    // Add new squares over time
    if (p.frameCount % 60 == 0 && squares.length < 10) {
      squares.push(new MovingSquare(p.random(50, 150), p.random(50, 150), p.random(2, 5), p.random(2, 5)));
    }

    // Change the cursor to a pointer if hovering over a square, otherwise default
    if (hovering) {
      p.cursor('pointer'); // Show pointer cursor
    } else {
      p.cursor('default'); // Reset to default cursor
    }
  };

  p.mousePressed = function() {
    for (let i = squares.length - 1; i >= 0; i--) {
      if (squares[i].clicked()) {
        score++;
        explosions.push(new Explosion(squares[i].x, squares[i].y, squares[i].w, squares[i].h)); // Add explosion
        squares.splice(i, 1); // Remove square when clicked
      }
    }
  };

  // Class for moving squares
  class MovingSquare {
    constructor(w, h, xSpeed, ySpeed) {
      this.x = p.random(p.width);
      this.y = p.random(p.height);
      this.w = w;
      this.h = h;
      this.xSpeed = xSpeed;
      this.ySpeed = ySpeed;
    }

    move() {
      this.x += this.xSpeed;
      this.y += this.ySpeed;

      // Bounce off edges
      if (this.x + this.w > p.width || this.x < 0) {
        this.xSpeed *= -1;
      }
      if (this.y + this.h > p.height || this.y < 0) {
        this.ySpeed *= -1;
      }
    }

    display() {
      p.image(targetImg, this.x, this.y, this.w, this.h);
    }

    clicked() {
      return p.mouseX > this.x && p.mouseX < this.x + this.w && p.mouseY > this.y && p.mouseY < this.y + this.h;
    }
  }

  // Class for handling explosion animation
  class Explosion {
    constructor(x, y, w, h) {
      this.x = x;
      this.y = y;
      this.size = Math.max(w, h);
      this.life = 30; // Frames for explosion animation
    }

    animate() {
      p.image(explosionGif, this.x, this.y, this.size, this.size); // Display gif at the explosion location
      this.life--;
    }

    finished() {
      return this.life <= 0;
    }
  }
};
