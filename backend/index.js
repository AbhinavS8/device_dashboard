const express = require("express");
const app = express();
const mqtt= require("mqtt");
import { MQTTService } from "./services/mqttService.js";

app.get("/", (req,res) => {
    res.send("waz good from express+node")
})

app.listen(3000,() => console.log(`server starting...`))
