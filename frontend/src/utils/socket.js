import { io } from "socket.io-client";

const SOCKET_URL = "https://connect-campus-demo.onrender.com"; // or http://localhost:5000 for local dev
export const socket = io(SOCKET_URL, {
  transports: ["websocket"],
  autoConnect: false,
});
