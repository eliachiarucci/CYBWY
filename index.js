const myGameArea = {
    canvas: document.createElement('canvas'),
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
  
  function updateGameArea() {
    myGameArea.clear();
    myGameArea.context.strokeRect(0, 0, myGameArea.canvas.width, myGameArea.canvas.height)
  };
  
  myGameArea.start();
  
// Component class
class Component {
  constructor(width, height, color, x, y) {
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

/*   left() {
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
  } */

  crashWith(obstacle) {
    return !(
      this.bottom() < obstacle.top() ||
      this.top() > obstacle.bottom() ||
      this.right() < obstacle.left() ||
      this.left() > obstacle.right()
    );
  }
}

