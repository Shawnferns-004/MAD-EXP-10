import { Server } from "socket.io";

const setupSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "*",
    },
  });

  io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    socket.on("sendReport", (data) => {
      io.emit("receiveNotification", { message: "New report received", data });
    });

    socket.on("updateDetails", (data) => {
      io.emit("receiveNotification", { message: "Details updated", data });
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });

  return io;
};

export default setupSocket;
