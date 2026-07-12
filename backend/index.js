const express = require("express");
const cors = require("cors");
const http = require("http");
const socketio = require("socket.io");
const mqtt = require("mqtt");
const mongoose = require("mongoose");

const config = require("./config/env.js");
const SensorData = require("./models/sensorData.js");
const databaseConnection = require("./config/database.js");

const topicRoutes = require("./routes/topicRoutes");



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

    const client = mqtt.connect(process.env.MQTT_URL);
client.on("connect", () => {
  console.log("Connected to MQTT broker");
  // client.subscribe("myhome/sensors/temperature"); 
  // client.subscribe("myhome/sensors/humidity");

  //multiple clients, one for each graph
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
      client.subscribe(message);
    })

    socket.on("disconnect", ()=> {
        console.log("user disconnected");
      })
});

// Handle MQTT messages globally (outside socket connection)
client.on("message", async (topic, message) => {
  try {
    const parsed = JSON.parse(message.toString());
    io.emit("sensorUpdate", { topic, ...parsed });
    // Store in MongoDB
    await SensorData.create({ topic, data: parsed });
    console.log(`Stored data for topic: ${topic}`);
  } catch (err) {
    console.error("Failed to parse MQTT message:", message.toString());
  }
});


server.listen(port, () => console.log(`server starting...`));


  } catch (error) {
    console.error("Application failed to start:", error);
    // Exit the process if setup fails
    process.exit(1);
  }
})();

