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
  client.subscribe("myhome/sensors/temperature"); // replace with your topic
});

app.use(cors());
const port=5000;

app.get("/", (req,res) => {
    res.send("waz good from express+node")
})

// app.get("/api/data", (req,res) => {
//     res.json({
//     message: "Hello from the backend",
//     sensors: [
//       { id: 1, name: "Temperature Sensor", value: 25 },
//       { id: 2, name: "Humidity Sensor", value: 60 }
//     ]
//   });
// })

app.get("/ping", (_req, res) => {
  return res.json({ msg: "Ping Successful" });
});

//websocket
io.on("connection", (socket) => {
    console.log("new user detected");

    socket.emit('newMessage', { from: 'Server', text: 'Welcome!', createdAt: Date.now() });

    
    
    // const interval = setInterval(() =>{
    //   const sensorData = {
    //     temperature: 35,
    //     humidity: Math.random(),
    //     timestamp: Date.now()
    //   }
      
    //   io.emit("sensorUpdate", sensorData);
    // },2000);
    

    client.on("message", (topic, message) => {
      try {
        const parsed = JSON.parse(message.toString()); // 👈 convert string → object
        io.emit("sensorUpdate", parsed); // send as object
      } catch (err) {
        console.error("Failed to parse MQTT message:", message.toString());
      }
    });


    socket.on("disconnect", ()=> {
        console.log("user disconnected");
        // clearInterval(interval); // stop sending when client leaves
      })
});


server.listen(port,() => console.log(`server starting...`))
