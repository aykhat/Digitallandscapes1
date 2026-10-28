let pacImg;
let x, y;
let pacSize = 60; // Starting size of Pacman
let dots = [];
let lastButtonPressB = false;

// Music variables for background music
let bgMusic;
let musicStarted = false;

function preload() {
  // Load my uploaded image and music files
  pacImg = loadImage('oacmn.gif');
  bgMusic = loadSound('pacman_theme.mp3');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  imageMode(CENTER); // Center the image coordinates

  x = width / 2;
  y = height / 2;

  // Set initial size of the image using p5 resize()
  pacImg.resize(pacSize, pacSize);

  spawnDots();
}

function draw() {
  background(10); // Solid dark background

  let gamepads = navigator.getGamepads ? navigator.getGamepads() : [];
  let gp = gamepads[0];

  if (gp) {
    // Movement of pacman gif with the Joystick
    let deadzone = 0.15;
    let moveX = Math.abs(gp.axes[0]) > deadzone ? gp.axes[0] : 0;
    let moveY = Math.abs(gp.axes[1]) > deadzone ? gp.axes[1] : 0;

    x += moveX * 8;
    y += moveY * 8;

    // Keep Pac-Man inside screen 
    x = constrain(x, pacSize / 2, width - pacSize / 2);
    y = constrain(y, pacSize / 2, height - pacSize / 2);

    // Starts the music and resets with controller key B
    if (gp.buttons[1] && gp.buttons[1].pressed) {
      if (!lastButtonPressB) {
        if (!musicStarted) {
          userStartAudio();
          bgMusic.loop();
          musicStarted = true;
        }

        x = width / 2;
        y = height / 2;
        pacSize = 60;
        pacImg.resize(pacSize, pacSize); // Reset image size
        spawnDots();
        lastButtonPressB = true;
      }
    } else {
      lastButtonPressB = false;
    }

    // Draw and eat dots
    let allEaten = true;

    for (let i = 0; i < dots.length; i++) {
      if (dots[i].active) {
        allEaten = false; // At least one dot is still active

        fill(255, 220, 0); // Yellow food dots
        noStroke();
        circle(dots[i].x, dots[i].y, 16);

        // Checks distance for eating using p5 dist() function
        let d = dist(x, y, dots[i].x, dots[i].y);
        if (d < pacSize / 2) {
          dots[i].active = false; // Turn off the dot so it disappears
          pacSize += 12;          // Increase size variable
          pacImg.resize(pacSize, pacSize); // p5 resize function makes the GIF bigger!
        }
      }
    }

    // Respawn dots automatically when all are eaten
    if (allEaten) {
      spawnDots();
    }

    // 4. DRAW PAC-MAN IMAGE
    image(pacImg, x, y, pacSize, pacSize);

  } else {
    // Controller prompt
    fill(255);
    noStroke();
    textAlign(CENTER, CENTER);
    textSize(18);
    text("Press any button on your controller to start!", width / 2, height / 2);
  }
}

// Function to generate random dots with an active toggle
function spawnDots() {
  dots = [];
  for (let i = 0; i < 10; i++) {
    dots.push({
      x: random(100, width - 100),
      y: random(100, height - 100),
      active: true // Dot starts visible
    });
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}