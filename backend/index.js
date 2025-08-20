const express = require("express");
const app = express();
const cors = require("cors");
// const mqtt= require("mqtt");
// import { MQTTService } from "./services/mqttService.js";
app.use(cors());

app.get("/", (req,res) => {
    res.send("waz good from express+node")
})

app.get("/api/data", (req,res) => {
    res.json({
    message: "Hello from the backend 👋",
    sensors: [
      { id: 1, name: "Temperature Sensor", value: 25 },
      { id: 2, name: "Humidity Sensor", value: 60 }
    ]
  });
})

app.get("/ping", (_req, res) => {
  return res.json({ msg: "Ping Successful" });
});

app.listen(5000,() => console.log(`server starting...`))
