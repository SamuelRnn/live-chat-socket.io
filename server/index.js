import express from "express";
import morgan from "morgan";
import { Server as SocketServer } from "socket.io";
import cors from "cors";
import http from "http";

const app = express();
const server = http.createServer(app);
const socket = new SocketServer(server, {
  cors: {
    origin: "*",
  },
});

app.use(cors());
app.use(morgan("dev"));

socket.on("connection", (socket) => {
  socket.on("message", (msg) => {
    console.log(msg);
    socket.broadcast.emit("message", msg);
  });
});

server.listen(3001, () => {
  console.log("ready on port", 3001);
});
