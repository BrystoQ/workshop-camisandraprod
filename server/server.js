require("dotenv").config();
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_ORIGIN,
    methods: ["GET", "POST"],
  },
});

const rooms = {};

io.on("connection", (socket) => {
  socket.on("createRoom", ({ roomId, userName, gameId }) => {
    if (!rooms[roomId]) {
      rooms[roomId] = {
        users: [],
        creator: socket.id,
        gameId: gameId,
        answers: [],
        questionIndex: 0,
        totalQuestions: 0,
      };
    }
    rooms[roomId].users.push(userName);
    socket.join(roomId);
    socket.roomId = roomId;
    socket.userName = userName;
    socket.isCreator = true;
    io.to(roomId).emit("updateRoom", { userName, action: "joined" });
    io.to(roomId).emit("roomUsers", rooms[roomId].users);
    socket.emit("roomCreator", rooms[roomId].creator);
    socket.emit("gameChosen", rooms[roomId].gameId);
  });

  socket.on("joinRoom", ({ roomId, userName }) => {
    if (!rooms[roomId]) {
      socket.emit("roomNotFound");
      return;
    }
    rooms[roomId].users.push(userName);
    socket.join(roomId);
    socket.roomId = roomId;
    socket.userName = userName;
    socket.isCreator = false;
    io.to(roomId).emit("updateRoom", { userName, action: "joined" });
    io.to(roomId).emit("roomUsers", rooms[roomId].users);
    socket.emit("roomCreator", rooms[roomId].creator);
    socket.emit("gameChosen", rooms[roomId].gameId);
  });

  socket.on("startSession", (roomId, totalQuestions) => {
    if (rooms[roomId]) {
      rooms[roomId].totalQuestions = totalQuestions;
      rooms[roomId].answers = Array(totalQuestions)
        .fill(null)
        .map(() => ({}));
      io.to(roomId).emit("startSession", totalQuestions);
    }
  });

  socket.on("answer", ({ questionIndex, answer }) => {
    const roomId = socket.roomId;
    if (rooms[roomId]) {
      rooms[roomId].answers[questionIndex][socket.userName] = answer;

      const allUsersAnswered = rooms[roomId].users.every(
        (user) => rooms[roomId].answers[questionIndex][user] !== undefined
      );

      if (allUsersAnswered) {
        io.to(roomId).emit(
          "updateAnswers",
          rooms[roomId].answers[questionIndex]
        );
        if (questionIndex + 1 < rooms[roomId].totalQuestions) {
          rooms[roomId].questionIndex += 1;
          io.to(roomId).emit("nextQuestion", rooms[roomId].questionIndex);
        } else {
          io.to(roomId).emit("endQuiz", rooms[roomId].answers);
        }
      } else {
        io.to(roomId).emit(
          "updateAnswers",
          rooms[roomId].answers[questionIndex]
        );
      }
    }
  });

  socket.on("finalResults", (results) => {
    const roomId = socket.roomId;
    if (rooms[roomId] && socket.isCreator) {
      io.to(roomId).emit("startResult", results);
    }
  });

  socket.on("checkRoom", (roomId, callback) => {
    const roomExists = !!rooms[roomId];
    callback(roomExists);
  });

  socket.on("disconnect", () => {
    if (socket.roomId) {
      rooms[socket.roomId].users = rooms[socket.roomId].users.filter(
        (user) => user !== socket.userName
      );
      io.to(socket.roomId).emit("updateRoom", {
        userName: socket.userName,
        action: "left",
      });
      io.to(socket.roomId).emit("roomUsers", rooms[socket.roomId].users);
    }
  });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Listening on *:${PORT}`);
});
