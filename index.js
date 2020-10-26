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
  