const express = require("express");
const cors = require("cors");
const http = require("http");
const socketio = require("socket.io");
const mqtt= require("mqtt");

// import { MQTTService } from "./services/mqttService.js";
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
  client.subscribe("myhome/sensors/temperature"); 
  client.subscribe("myhome/sensors/humidity"); 
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
    // client.on("message", (topic, message) => {
    //   try {
    //     const parsed = JSON.parse(message.toString());
    //     io.emit("sensorUpdate", parsed); // send as object
    //   } catch (err) {
    //     console.error("Failed to parse MQTT message:", message.toString());
    //   }
    // });

    client.on("message", (topic, message) => {
      try {
        const parsed = JSON.parse(message.toString());
        io.emit("sensorUpdate", { topic, ...parsed });
      } catch (err) {
        console.error("Failed to parse MQTT message:", message.toString());
      }
    });

    socket.on("disconnect", ()=> {
        console.log("user disconnected");
      })
});


server.listen(port,() => console.log(`server starting...`))
