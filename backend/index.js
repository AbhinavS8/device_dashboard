const express = require("express");
const cors = require("cors");
const http = require("http");
const socketio = require("socket.io");
const mqtt = require("mqtt");
const mongoose = require("mongoose");

// MongoDB connection
mongoose.connect("mongodb://localhost:27017/device_dashboard", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB");
});

// Sensor Data Schema
const sensorDataSchema = new mongoose.Schema({
  topic: String,
  data: mongoose.Schema.Types.Mixed,
  timestamp: { type: Date, default: Date.now },
});
const SensorData = mongoose.model("SensorData", sensorDataSchema);
const app = express();
const server = http.createServer(app); //needed to hook in socketio explicitly
const io = socketio(server, {
  cors: {
    origin: "http://localhost:3000", // React dev server
    methods: ["GET", "POST"]
  }
});

const client = mqtt.connect("mqtt://test.mosquitto.org:1883");
client.on("connect", () => {
  console.log("Connected to MQTT broker");
  // client.subscribe("myhome/sensors/temperature"); 
  // client.subscribe("myhome/sensors/humidity");

  //multiple clients, one for each graph
});

app.use(cors());
const port=5000;

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
      console.log("subscribing to:", message);
      client.subscribe(message);
    });

    socket.on("disconnect", () => {
      console.log("user disconnected");
    });
});

// Only attach MQTT message handler once, globally
client.on("message", async (topic, message) => {
  try {
    const parsed = JSON.parse(message.toString());
    io.emit("sensorUpdate", { topic, ...parsed });
    // Store in MongoDB
    await SensorData.create({ topic, data: parsed });
  } catch (err) {
    console.error("Failed to parse MQTT message:", message.toString());
  }
});



// API endpoint to get data for a topic
app.get("/api/topic/:topic", async (req, res) => {
  try {
    const topic = req.params.topic;
    // Get last 100 entries for the topic
    const data = await SensorData.find({ topic }).sort({ timestamp: 1 }).limit(100);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch topic data" });
  }
});

server.listen(port, () => console.log(`server starting...`));
