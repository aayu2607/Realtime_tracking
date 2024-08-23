const express = require("express");
const socketio = require("socket.io");
const http = require("http");
const path = require("path");

const app = express();
app.use(express.json());

const server = http.createServer(app);
const io = socketio(server);

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);  // Each client has a unique socket.id

    socket.on("send-location", (data) => {
        // Emit the location data to all clients, including the sender
        console.log(`Location from ${socket.id}: ${data.latitude}, ${data.longitude}`);
        io.emit("receive-location", { id: socket.id, ...data });
    });

    socket.on("disconnect", () => {
        console.log(`User disconnected: ${socket.id}`);
        // Notify all clients that a user has disconnected
        io.emit("user-disconnected", socket.id);
    });
});

app.get("/", (req, res) => {
    res.render("index");
});

server.listen(3000, () => {
    console.log("Server running on port 3000");
});
