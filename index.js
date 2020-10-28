const myGameArea = {
  canvas: document.createElement('canvas'),
  frames: 0,
  score: 0,
  objectsSpeed: 5,
  initialize: function () {
    initializeGameArea();
  },
  createCanvas: function () {
    this.canvas.width = 1000;
    this.canvas.height = 350; // -85 // 265 // -145 // 205
    this.context = this.canvas.getContext("2d");
    document.body.insertBefore(this.canvas, document.body.childNodes[0]);
  },
  lose: function () {
    this.stop();
    //document.getElementsByTagName("canvas")[0].style.display = "none";
    document.getElementById("end-screen").style.display = "block";
  },
  start: function () {
    this.interval = setInterval(updateGameArea, 17);
    document.getElementsByTagName("canvas")[0].style.display = "block";
  },
  clear: function () {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  },
  stop: function () {
    clearInterval(this.interval);
  }
}

function replayGame() {
  document.getElementById("end-screen").style.display = "none"; 
  myGameArea.frames = 0;
  myGameArea.score = 0;
  newObstaclesArray = [];
  myGameArea.initialize();
  myGameArea.start();
}

function startGame() {
  document.getElementById("start-screen").style.display = "none"; 
  myGameArea.createCanvas();
  myGameArea.initialize();
  myGameArea.start();
  document.getElementById('theme-song').play('./sounds/CYBYWY-theme-song.mp3');
}

class Component {
  constructor(x, y, color, width, height, type, image) {
    this.width = width;
    this.height = height;
    this.color = color;
    this.x = x;
    this.y = y;
    this.type = type;
    this.image = image;
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
    // ctx.fillRect(this.x, this.y, this.width, this.height);
    ctx.drawImage(this.image, this.x, this.y, this.width, this.height)
  }

  left() {
    return this.x;2
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
    if (this.jumps < 2) {
      this.speedY = -6;
      this.jumps++;
      return true;
    } else {
      return false;
    }
  }

  gravity() {
    let gravity = 0.15;
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



const gameState = {
  currentState: "menu", // If it is Menu, game is stopped and menu appears, if it is gaming, game resume and frames updates
  currentLevel: "level1",
  level1: [
    {space: "hallway", state: "public", background:"./img/hallway-background.png",fromX: 0, toX: 1000},
    {space: "bedroom", state: "public", background:"./img/Lounge-background.png", fromX: 1001, toX: 2000},
    {space: "kitchen", state: "public", background:"./img/kitchen-background.png", fromX: 2001, toX: 3000},
    {space: "toilets", state: "private", background:"./img/bedroom-background.png", fromX: 3001, toX: 4000},
    {space: "bathroom", state: "private", background:"./img/bathroom-background.png", fromX: 4001, toX: 5000},
    {space: "livingroom", state: "public", background:"./img/livingroom-background.png",fromX: 5001, toX: 6000},
    {space: "bedroom2", state: "private", background:"./img/bedroom-background.png", fromX: 6001, toX: 7000},
    {space: "garage", state: "public", background:"./img/hallway-background.png", fromX: 7001, toX: 7000},
    {space: "backyard", state: "public", background:"./img/garden-background.png", fromX: 8001, toX: 9000},
   ],
}

// * Creating an HTML empty element to contain all the IMG elements
// * We are doing this together with the appenChild method below in order to then have an HTML Collection to loop through
// ! Can't use a normal Javascript array to containt HTML Elements
var backgroundArray = document.createDocumentFragment(); 
function state (gameState, frames){ // * The meaning of this function is to check wether we are in a public or private based on the frame we are looking for
  let space = gameState.level1.filter(obj => { // * Creating a new array containing only the object which has fromX < frames < toX 
    if ( frames >= obj.fromX && frames <= obj.toX) { 
      return true; // * The True here is to make the "filter" method work, filter will loop through the array returning the objects which pass True to the test given
    } 
  })
  return space[0].state; // * Even if we know the the filter function will return only 1 object, it is still an array containing one object, so we will need to access it at the first index first, and then get the state value
}

let newObstaclesArray = [];
let player;

function initializeGameArea() {
  // New player
  let image = document.createElement('img')
  image.src = './img/pirates.png'
  player = new Player(20, myGameArea.canvas.height-20, "red", 20, 20);
  for (let i = 0; i < 30; i++) {
  let position = randomPeopleX(i);
  let privatePosition = randomBoobsX(i);
  if (state(gameState, position) === 'public') {
    const injectObstacle = Math.random()  
    if (injectObstacle < 0.5) {
      const newPerson = (new Component(position, randomPeople(), "purple", 20, 20, "people", image));
      newPerson.speedX -= myGameArea.objectsSpeed;
      newObstaclesArray.push(newPerson);

    } else {
      const newBoob = (new Component(position, randomBoobs(), "green", 20, 20, "boob", image));
      newBoob.speedX -= myGameArea.objectsSpeed;
      newObstaclesArray.push(newBoob);
    } 
  } else  if (state(gameState, privatePosition) === 'private') {
    console.log(randomBoobsX(i))  
    const newBoob = (new Component(privatePosition, randomBoobs(),  "red", 20, 20, "boob", image));
      newBoob.speedX -= myGameArea.objectsSpeed;
      newObstaclesArray.push(newBoob);
  }
}


 /*  for (let i = 0; i < 40; i++) {
    let position = randomBoobsX(i);
    const newBoob = (new Component(position, randomBoobs(), "green", 20, 20, "boobs"));
    newBoob.speedX-= 1;
    newObstaclesArray.push(newBoob);
  }  */

  // Declare obstacle array
  let currentLevel = gameState.currentLevel // * Accessing the current level
  for (let i = 0; i < gameState[currentLevel].length; i++) { 
    if ("background" in gameState[currentLevel][i]) { // * Checking if the space in the level has the background key, it should always have one in order to draw the background
      let backgroundURL = gameState[currentLevel][i].background; // * Getting the url in the background key
      let image = document.createElement("img"); // * Creating a new IMG element
      image.src = backgroundURL; // * Assigning the backgroundURL to the src of the newly created IMG element
      backgroundArray.appendChild(image); // * Appending the IMG element to the HTML empty element in order to have an HTML Collection
    }
  }
}

function updateGameArea() {
  myGameArea.clear();
  myGameArea.context.strokeRect(0, 0, myGameArea.canvas.width, myGameArea.canvas.height);
  updateBackround();
  drawScore();
  updateObstacles();
  player.newPos();
  player.update();
  player.gravity();
  checkCollision();  
  myGameArea.frames += myGameArea.objectsSpeed;
  checkEndLevel();
  // console.log(player.y);
};

function updateBackround() {
  for (let i = 0; i < backgroundArray.childNodes.length; i++) { // * Looping through the HTML Collection containing all the IMG elements
    myGameArea.context.drawImage(backgroundArray.childNodes[i], (i*1000)-myGameArea.frames, 0, 1000, 350); // * Drawing each background IMG elements at i*1000, which is the spacing between spaces 
  }
}

function drawScore() {
  myGameArea.context.fillStyle = "black";
  myGameArea.context.font = "20px Arial";
  myGameArea.context.fillText("Score: " + myGameArea.score, 20, 20);
}

function updateObstacles() {
  for (let i = 0; i < newObstaclesArray.length; i++) {
    newObstaclesArray[i].newPos();
    newObstaclesArray[i].update();
  }
}


function checkCollision() {
  const collisionObjArr = newObstaclesArray.filter((obstacle) => { // * Creating a new array containing only the objects which returns true from the crashWith method
    return player.crashWith(obstacle)
  })
  // * IF COLLIDING WITH SOMETHING
  if (collisionObjArr.length) {
    if (state(gameState, myGameArea.frames) === "public") { //IF COLLIDING WITH SOMETHING WHILE IN PUBLIC
      myGameArea.lose();
    } else if (state(gameState, myGameArea.frames) === "private") { //IF COLLIDING WITH SOMETHING WHILE IN PRIVATE
      myGameArea.score++;
      collisionObjArr.forEach((obstacle) => {
        let obstacleIndex = newObstaclesArray.indexOf(obstacle); 
        newObstaclesArray.splice(obstacleIndex, 1);
        // console.log(myGameArea.score)
      })
    }
  }
}


function checkEndLevel() {
  let levelArray = gameState[gameState.currentLevel];
  let lastSpace = levelArray[levelArray.length-1];
  //console.log(myGameArea.frames, lastSpace.toX);
  if (myGameArea.frames >= lastSpace.toX) {
    myGameArea.stop();
    console.log("STOP");
    document.getElementById("end-screen").style.display = "block";
  }
}


document.addEventListener('keydown', (e) => {
  if (e.code === "Space") {
    if(player.jump()) {
      let audio = document.getElementById('jump');
      audio.currentTime = 0;
      audio.play();
    }
  }
})

const randomBoobs = () => {
  let maxHeight =  200;
  let minHeight = 270;
  let heightRange = Math.floor(Math.random() * (maxHeight - minHeight + 1) + minHeight);
  return heightRange;
}

const randomPeople = () => {
  let maxHeight =  230;
  let minHeight = 330;
  let heightRange = Math.floor(Math.random() * (maxHeight - minHeight + 1) + minHeight);
  return heightRange;
}

const randomBoobsX = (i) => {
  //Looping through obstacle creation feeding the obstacle array
  let maxSpacing = 200;
  let minSpacing = 100;
  let randomSpacing = Math.floor(Math.random() * (maxSpacing - minSpacing + 1) + minSpacing);
  const position = (i+1)*randomSpacing;
  return position
}

const randomPeopleX = (i) => {
  let maxSpacing = 200;
  let minSpacing = 100;
  let randomSpacing = Math.floor(Math.random() * (maxSpacing - minSpacing + 1) + minSpacing);
  const position = (i+1)*randomSpacing;
  return position
}

/* Archived code

function checkCollision() {
  const collisionObjArr = newObstaclesArray.filter((obstacle) => { // * Creating a new array containing only the objects which returns true from the crashWith method
    return player.crashWith(obstacle)
  })
  // * IF COLLIDING WITH SOMETHING
  if (collisionObjArr.length) {
    if (state(gameState, myGameArea.frames) === "public") { //IF COLLIDING WITH SOMETHING WHILE IN PUBLIC
      myGameArea.stop();
    } else if (state(gameState, myGameArea.frames) === "private") { //IF COLLIDING WITH SOMETHING WHILE IN PRIVATE
      myGameArea.score++;
      collisionObjArr.forEach((obstacle) => {
        let obstacleIndex = newObstaclesArray.indexOf(obstacle); 
        newObstaclesArray.splice(obstacleIndex, 1);
      })
    }
  }
}


Loop through the locations of the game to create obstacles only in places where it is necessary
1. People are Obstacles in public
2. Boobs and balls are also obstacles in public
3. Boobs and balls are not obstacles
Use a for loop to go through px 0 to 9000
Leverage the this.type in component class

for (let frames = 0; frames < array.length; frames++) { // ! This for loop was not complete yet, Had to comment it out in order to test new things
    const newObstacles = 0;
    if (state(gameState,) === 'public') {
        newObstacle.push(new Component(20, height, "green", 0, 0, boobs));
    } else if (state(gameState) === 'public') {
        newObstacle.push(new Component(20, height, "green", 0, 0, people))
    } else {  
    }
} 

       

*/