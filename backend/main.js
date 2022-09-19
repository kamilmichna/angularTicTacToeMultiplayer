const dotenv = require('dotenv');
const express = require('express');
dotenv.config();
const httpServer = require("http").createServer();


// host angular
if (process.env.prod) {
  const app = express();
  app.use('/', express.static('../dist/uttt'));
  app.listen(80)
}
const io = require("socket.io")(httpServer, {
  cors: {
    origin: "http://localhost",
    methods: ["GET", "POST"]
  }
});

const generateNewRoomId = () => {
  let id;
  while (true) {
    id = nanoid(6);
    if (!doRoomWithIdExists(id)){
      break;
    }
  }
  return id;
}

const doRoomWithIdExists = (id) => {
  return Array.from(io.sockets.adapter.rooms)?.map(item=>item[0]).includes(id)
}

// handlers
const handleUserAction = (socket) => {
  socket.on('userAction', (userAction, roomId) => {
    console.log(roomId);
    socket.to(roomId).emit('userAction',userAction)
  })
}

const handleRoomCreating = (socket) => {
  socket.on('createRoom', () => {
    console.log('123')
    const id = generateNewRoomId();
    socket.join(id);
    socket.emit('returnedRoomId', id);
  })
}


const handleRoomJoining = (socket) => {
  socket.on('joinRoom', (roomId) => {
    console.log(Array.from(io.sockets.adapter.rooms));
    if (!doRoomWithIdExists(roomId)) {
      console.log("BAd")
      return;
    }
    socket.join(roomId);
    socket.emit('returnedRoomId', roomId);
  })
}

io.on("connection", (socket) => {
  console.log('new connection arrived!')
  handleUserAction(socket);
  handleRoomCreating(socket);
  handleRoomJoining(socket);
});



io.listen(3000);