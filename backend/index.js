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



// API endpoint to get data for a topic
app.get("/api/topic/:topic", async (req, res) => {
  try {
    const topic = req.params.topic;
    const limit = parseInt(req.query.limit) || 100;
    // Get last entries for the topic
    const data = await SensorData.find({ topic }).sort({ timestamp: -1 }).limit(limit);
    res.json(data.reverse()); // Reverse to get chronological order
  } catch (err) {
    console.error("Error fetching topic data:", err);
    res.status(500).json({ error: "Failed to fetch topic data" });
  }
});

// API endpoint to get all available topics
app.get("/api/topics", async (req, res) => {
  try {
    const topics = await SensorData.distinct("topic");
    res.json(topics);
  } catch (err) {
    console.error("Error fetching topics:", err);
    res.status(500).json({ error: "Failed to fetch topics" });
  }
});

// API endpoint to get sensor data count for a topic
app.get("/api/topic/:topic/count", async (req, res) => {
  try {
    const topic = req.params.topic;
    const count = await SensorData.countDocuments({ topic });
    res.json({ topic, count });
  } catch (err) {
    console.error("Error counting topic data:", err);
    res.status(500).json({ error: "Failed to count topic data" });
  }
});

// API endpoint to delete old data (optional cleanup)
app.delete("/api/topic/:topic/cleanup", async (req, res) => {
  try {
    const topic = req.params.topic;
    const keepLast = parseInt(req.query.keep) || 1000;
    
    // Find oldest records to delete
    const totalCount = await SensorData.countDocuments({ topic });
    if (totalCount > keepLast) {
      const toDelete = totalCount - keepLast;
      const oldestRecords = await SensorData.find({ topic })
        .sort({ timestamp: 1 })
        .limit(toDelete)
        .select('_id');
      
      const idsToDelete = oldestRecords.map(record => record._id);
      await SensorData.deleteMany({ _id: { $in: idsToDelete } });
      
      res.json({ deleted: toDelete, remaining: keepLast });
    } else {
      res.json({ deleted: 0, remaining: totalCount });
    }
  } catch (err) {
    console.error("Error cleaning up topic data:", err);
    res.status(500).json({ error: "Failed to cleanup topic data" });
  }
});

server.listen(port, () => console.log(`server starting...`));
