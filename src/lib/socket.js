// lib/socket.js
import { Server } from "socket.io";

const userSocketMap = {}; // { userId: socketId }
let io; // declare io at module level

export function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}

export function setupSocket(server) {
  io = new Server(server, {
    cors: {
      origin: ["http://localhost:5173", "https://chatorbit-frontend.vercel.app"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("A user connected", socket.id);

    const url = new URL(`http://localhost?${socket.handshake.url.split("?")[1] || ""}`);
    const userId = url.searchParams.get("userId");

    if (userId) {
      userSocketMap[userId] = socket.id;
    }

    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    socket.on("disconnect", () => {
      console.log("A user disconnected", socket.id);
      if (userId) {
        delete userSocketMap[userId];
      }
      io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });
  });
}

export { io };
