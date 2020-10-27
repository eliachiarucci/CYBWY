const myGameArea = {
    canvas: document.createElement('canvas'),
    frames: 0,
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

class Component {
    constructor(x, y, color, width, height) {
      this.width = width;
      this.height = height;
      this.color = color;
      this.x = x;
      this.y = y;
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
        this.img.src = "./img/hands-color.png";
    }

    update() {
        const ctx = myGameArea.context;
        ctx.fillStyle = this.color;
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
      }

    jump() {
        if (this.jumps < 2) this.speedY = -5, this.jumps++;
        this.inAir = true;
    }

    gravity() {
        let gravity = 0.2;
        if (this.y + this.speedY < myGameArea.canvas.height) {
            this.speedY += gravity;
        } else {
            this.speedY = 0;
            this.jumps = 0;
            this.y = myGameArea.canvas.height;
        }
    }
}

myGameArea.start(); // Starting MyGameArea before declaring stuff because otherwise canvas.height will not be overwrited to 300 (will still be at default value = 150)

const flappyBoobs = new Player(20, myGameArea.canvas.height, "red", 20, -20);

const flappyObstacle = new Component(200, myGameArea.canvas.height, "black", 20, -20);
flappyObstacle.speedX -= 1;

const backgroundImg = document.createElement('img');
backgroundImg.src = "./img/Lounge-background.png";


const gameState = {
    currentState: "menu", // If it is Menu, game is stopped and menu appears, if it is gaming, game resume and frames updates
    level1: [
      {space: "bedroom",state: "private", fromX: 0, toX: 1000},
      {space: "toilets",state: "private", fromX: 1000, toX: 2000},
      {space: "kitchen",state: "public", fromX: 2000, toX: 3000},
      {space: "hallway",state: "public", fromX: 3000, toX: 4000},
      {space: "bathroom",state: "private", fromX: 4000, toX: 5000},
      {space: "livingroom",state: "public", fromX: 5000, toX: 6000},
      {space: "backyard",state: "public", fromX: 6000, toX: 7000},
      {space: "garage",state: "public", fromX: 7000, toX: 8000},
      {space: "bedroom",state: "private", fromX: 8000, toX: 9000},
     ],

  }
  
  function state (arr){
    for (let i = 0 ; i < arr.length; i++){
      if (arr[i].state === "private"){
        if (myGameArea.frames > arr[i].fromX && myGameArea.frames < arr[i].toX){
         console.log('the room is private,' + /*flappyBoobs is at ${myGameArea.frames}*/'flappyBoobs is in between ' + arr[i].fromX + ' and ' + arr[i].toX)
          //TODO IF IN PRIVATE --> WHEN HITTING OBSTACLE ---> SCORE +1
        }
      }else if (arr[i].state === "public"){
        if (myGameArea.frames > arr[i].fromX && myGameArea.frames < arr[i].toX){
          console.log('the room is public,' + /*flappyBoobs is at ${myGameArea.frames}*/'flappyBoobs is in between ' + arr[i].fromX + ' and ' + arr[i].toX)
          if (crashWith(obstacle)){
            myGameArea.stop
          }
        }
      } 
    }
  } 
  // * state(gameState.level1) 


function updateGameArea() {
    myGameArea.clear();
    myGameArea.context.strokeRect(0, 0, myGameArea.canvas.width, myGameArea.canvas.height); // Black borders
    console.log(myGameArea.frames);
    myGameArea.context.drawImage(backgroundImg, 0-myGameArea.frames, 0, 1000, 350);
    flappyBoobs.newPos();
    flappyBoobs.update();
    flappyBoobs.gravity(); // Simulate gravity to bring back the player after the jump
    flappyObstacle.newPos();
    flappyObstacle.update();
    state(gameState.level1); // Not working after 2000, when enters public space, "crashWith is not defined"
    myGameArea.frames += 1;
};

// Jump KeyListener -- When player clicks Space, jump method form Player class is called.
document.addEventListener('keydown', (e) => {
    if (e.code === "Space") {
        flappyBoobs.jump();
    }
})

