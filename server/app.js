import express from "express";
import http from "http";
import { Server as SocketServer } from "socket.io";

const app = express();
const server = http.createServer(app);
const port = process.env.PORT || 3001;
const io = new SocketServer(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
});

let userList = [];

io.on("connection", (socket) => {
    socket.on("message", ({ from, body }) => {
        socket.broadcast.emit("message", {
            from,
            body,
        });
    });

    socket.on("privateMessage", ({ from, body, to }) => {
        const recipientSocket = Array.from(io.sockets.sockets.values()).find((s) => s.displayName === to);
        if (recipientSocket) {
            recipientSocket.emit("message", { from, body });
        }
    });

    socket.on("userData", ({ displayName, photoURL }) => {
        socket.displayName = displayName;
        if (!userList.some((user) => user.displayName === displayName)) {
            userList.push({ displayName, photoURL });
        }
        io.emit("userList", userList);
    });

    socket.on("userDisconnect", (user) => {
        if (user && user.displayName) {
            userList = userList.filter((u) => u.displayName !== user.displayName);
            io.emit("userList", userList);
        }
    });
});

server.listen(port, () => {
    console.log(`App listening on port ${port}`);
});

export default app;
