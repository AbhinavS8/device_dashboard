const express = require("express");
const cors = require("cors");
const http = require("http");
const socketio = require("socket.io");
const mongoose = require("mongoose");

const config = require("./config/env.js");
const databaseConnection = require("./config/database.js");
const mqttService = require("./services/mqttService.js");
const topicRoutes = require("./routes/topicRoutes");

const SensorData = require("./models/sensorData.js");



(async () => {
  try {
    // 1. Connect to MongoDB first and await the connection promise
    console.log("Attempting to connect to MongoDB...");
    await databaseConnection();

    const app = express();
    const server = http.createServer(app); //needed to hook in socketio explicitly
    const io = socketio(server, {
      cors: {
        origin: process.env.CORS_ORIGIN, // React dev server
        methods: ["GET", "POST"]
      }
    });

    mqttService.initialize((event, payload) => {
      io.emit(event, payload);
    });

app.use(cors());
const port=process.env.PORT;

app.use("/api", topicRoutes);

app.get("/", (req,res) => {
    res.send("waz good from express+node")
})


app.get("/ping", (_req, res) => {
  return res.json({ msg: "Ping Successful" });
});

//websocket
io.on("connection", (socket) => {
    console.log("new user detected");
    socket.emit('newMessage', { from: 'Server', text: 'Welcome!', createdAt: Date.now() });

    //current plan, send with topic, create graph for each topic
    
    socket.on("subscribeTopic", (message) => {
      console.log("subscribing to:",message);
      mqttService.subscribe(message);
    })

    socket.on("disconnect", ()=> {
        console.log("user disconnected");
      })
});



server.listen(port, () => console.log(`server starting...`));


  } catch (error) {
    console.error("Application failed to start:", error);
    // Exit the process if setup fails
    process.exit(1);
  }
})();

