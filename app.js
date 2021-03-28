const express = require("express");
const http = require("http");
const socketIo = require("socket.io");

const port = process.env.PORT || 4001;
const index = require("./routes/index");

const app = express();
app.use(index);

const server = http.createServer(app);

const io = socketIo(server); // < Interesting!

const YMAX = 400;
const XMAX = 200;
const DOWN = 'DOWN';
const UP = 'UP';
const RIGHT = 'RIGHT';
const LEFT = 'LEFT';


let interval;

io.on("connection", (socket) => {
  console.log("New client connected");
  // const  ball = {
  //   x: 200,
  //   y: 400
  // }
  // socket.emit("FromAPI", ball)
   startFlow(socket)
  // if (interval) {
  //   clearInterval(interval);
  // }
  // interval = setInterval(() => getApiAndEmit(socket), 1000);
  // socket.on("disconnect", () => {
  //   console.log("Client disconnected");
  //   clearInterval(interval);
  // });
});

const move = (ball) => {
  const xOrientation = ball.xOrientation;
  const yOrientation = ball.yOrientation;
  if(xOrientation == LEFT){
    ball.x = ball.x - 1; 
  }
  if(xOrientation == RIGHT){
    ball.x = ball.x + 1; 
  }
  if(yOrientation == UP){
    ball.y = ball.y - 1;
  } 
  if(yOrientation == DOWN){
    ball.y = ball.y + 1;
  }
  return ball;
}

const checkLimits = (ball) => {
  console.log(ball)
  const x = ball.x;
  const y = ball.y;

  if(x <= 0){
    ball.xOrientation = RIGHT;
  }
  if(x >= XMAX){
    ball.xOrientation = LEFT;
  }
  if(y <= 0){
    ball.yOrientation = DOWN;
  }
  if(y >= YMAX){
    ball.yOrientation = UP;
  }

  return ball;
}

const startFlow = (socket) => {
  let ball = {
    x: XMAX/2,
    y: YMAX/2,
    yOrientation: UP,
    xOrientation: LEFT
  }
    setInterval(() => {
      ball = checkLimits(ball)
      ball = move(ball)
      socket.emit("FromAPI", ball)
    }, 0.5);  
}

server.listen(port, () => console.log(`Listening on port ${port}`));