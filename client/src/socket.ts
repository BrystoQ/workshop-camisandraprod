import { io } from "socket.io-client";

const socket = io("http://10.120.129.19:4000", {
  transports: ["websocket"],
});

socket.on("connect", () => {
  console.log("Connected to server with id:", socket.id);
});

socket.on("disconnect", () => {
  console.log("Disconnected from server");
});

export default socket;
