const myGameArea = {
  canvas: document.createElement('canvas'),
  frames: 0,
  score: 0,
  start: function () {
    this.canvas.width = 600;
    this.canvas.height = 350;
    this.context = this.canvas.getContext("2d");
    document.body.insertBefore(this.canvas, document.body.childNodes[0]);
    this.interval = setInterval(updateGameArea, 20);
  },
  clear: function () {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  },
  stop: function () {
    clearInterval(this.interval);
  }
}

myGameArea.start();

class Component {
  constructor(x, y, color, width, height, type) {
    this.width = width;
    this.height = height;
    this.color = color;
    this.x = x;
    this.y = y;
    this.type= type;
    // speed properties
    this.speedX = 0;
    this.speedY = 0;
  }

  // newPos()
  newPos() {
    this.x += this.speedX;
    this.y += this.speedY;
  }

  update() {
    const ctx = myGameArea.context;
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }

  left() {
    return this.x;
  }
  right() {
    return this.x + this.width;
  }
  top() {
    return this.y;
  }
  bottom() {
    return this.y + this.height;
  }

  crashWith(obstacle) {
    return !(
      this.bottom() < obstacle.top() ||
      this.top() > obstacle.bottom() ||
      this.right() < obstacle.left() ||
      this.left() > obstacle.right()
    );
  }
}


class Player extends Component {
  constructor(x, y, color, width, height) {
    super(x, y, color, width, height);
    this.jumps = 0;
    this.img = document.createElement('img');
    this.img.src = "./img/hands-point-right.png";
  }

  update() {
    const ctx = myGameArea.context;
    ctx.fillStyle = this.color;
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
  }

  jump() {
    if (this.jumps < 2) this.speedY = -5, this.jumps++;
  }

  gravity() {
    let gravity = 0.2;
    if (this.y + this.speedY < myGameArea.canvas.height - 20) {
      this.speedY += gravity;
    } else {
      this.speedY = 0;
      this.jumps = 0;
      this.y = myGameArea.canvas.height - 20;
    }
  }

  crashWith(obstacle) {
    return !(
      this.bottom() < obstacle.top() ||
      this.top() > obstacle.bottom() ||
      this.right()-10 < obstacle.left() ||
      this.left() > obstacle.right()
    );
  }
}

// New player
const flappyBoobs = new Player(20, myGameArea.canvas.height-20, "red", 20, 20);

// Declare obstacle array
const flappyObstacleArray = []

//Looping through obstacle creation feeding the obstacle array
for (let i = 0; i < 1; i++) {
  const newObstacle = new Component((i+1)*150, myGameArea.canvas.height-20,"blue", 20, 20, "boobs");
  newObstacle.speedX -= 1;
  flappyObstacleArray.push(newObstacle);
}

const gameState = {
  currentState: "menu", // If it is Menu, game is stopped and menu appears, if it is gaming, game resume and frames updates
  level1: [
    {space: "bedroom", state: "private", fromX: 0, toX: 1000},
    {space: "toilets", state: "private", fromX: 1001, toX: 2000},
    {space: "kitchen", state: "public", fromX: 2001, toX: 3000},
    {space: "hallway", state: "public", fromX: 3001, toX: 4000},
    {space: "bathroom", state: "private", fromX: 4001, toX: 5000},
    {space: "livingroom", state: "public", fromX: 5001, toX: 6000},
    {space: "backyard", state: "public", fromX: 6001, toX: 7000},
    {space: "garage", state: "public", fromX: 7001, toX: 8000},
    {space: "bedroom", state: "private", fromX: 8001, toX: 9000},
   ],
  
}

function state (gameState, frames){
  let space = gameState.level1.filter(obj =>{
    if ( frames >= obj.fromX && frames <= obj.toX){
      return obj
    } 
  })
  return space[0].state;
}

const backgroundImg = document.createElement('img');
backgroundImg.src = "./img/Lounge-background.png";

function updateGameArea() {
  myGameArea.clear();
  myGameArea.context.strokeRect(0, 0, myGameArea.canvas.width, myGameArea.canvas.height);
  myGameArea.context.drawImage(backgroundImg, 0-myGameArea.frames, 0, 1000, 350);
  drawScore();
  updateObstacles();
  flappyBoobs.newPos();
  flappyBoobs.update();
  flappyBoobs.gravity();
  checkCollision();
  myGameArea.frames += 1;
  console.log(myGameArea.score)
};

function drawScore() {
  myGameArea.context.fillStyle = "black";
  myGameArea.context.font = "20px Arial";
  myGameArea.context.fillText("Score: " + myGameArea.score, 20, 20);
}

function updateObstacles() {
  for (let i = 0; i < flappyObstacleArray.length; i++) {
    flappyObstacleArray[i].newPos();
    flappyObstacleArray[i].update();
  }
}

function checkCollision() {
  const collisionObj = flappyObstacleArray.filter((obstacle) => {
    return flappyBoobs.crashWith(obstacle)
  })

  // IF COLLIDING WITH SOMETHING
  if (collisionObj.length) {
    console.log(collisionObj);
    console.log(state(gameState))
    if (state(gameState, myGameArea.frames) === "public") { //IF COLLIDING WITH SOMETHING WHILE IN PUBLIC
      myGameArea.stop();
    } else if (state(gameState, myGameArea.frames) === "private") { //IF COLLIDING WITH SOMETHING WHILE IN PRIVATE
      myGameArea.score++;
      flappyObstacleArray.shift();
    }
  }
}


// Loop through the locations of the game to create obstacles only in places where it is necessary
// 1. People are Obstacles in public
// 2. Boobs and balls are also obstacles in public
// 3. Boobs and balls are not obstacles
// Use a for loop to go through px 0 to 9000
// Leverage the this.type in component class
for (let frames = 0; frames < array.length; frames++) {
    const newObstacles = 0;
    if (state(gameState,) === 'public') {
        newObstacle.push(new Component(20, height, "green", 0, 0, boobs));
    } else if (state(gameState) === 'public') {
        newObstacle.push(new Component(20, height, "green", 0, 0, people))
    } else { 
        
    }
    
    
}


document.addEventListener('keydown', (e) => {
  if (e.code = "Space") {
    flappyBoobs.jump();
    document.getElementById('theme-song').play('/sounds/CYBYWY-theme-song.mp3')
    document.getElementById('jump').play('/sounds/Mario-jump-Sound.mp3')
  }
})