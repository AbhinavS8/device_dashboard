// services/mqttService.js

const mqtt = require("mqtt");
const telemetryService = require("./telemetryService");

let client;

/**
 * Connect to the MQTT broker and register callbacks.
 */
function initialize(io) {
  client = mqtt.connect(process.env.MQTT_URL);

  client.on("connect", () => {
    console.log("Connected to MQTT broker");
  });

  client.on("error", (err) => {
    console.error("MQTT Error:", err);
  });

  client.on("close", () => {
    console.log("Disconnected from MQTT broker");
  });

  client.on("message", async (topic, message) => {
    try {
      const parsed = JSON.parse(message.toString());

      // Store in MongoDB
      await telemetryService.saveReading(topic, parsed);

      // Broadcast to all connected clients
      io.emit("sensorUpdate", {
        topic,
        ...parsed,
      });

      console.log(`Stored data for topic: ${topic}`);
    } catch (err) {
      console.error("Failed to process MQTT message:", err);
    }
  });
}

/**
 * Subscribe to an MQTT topic.
 */
function subscribe(topic) {
  if (!client) {
    throw new Error("MQTT client has not been initialized.");
  }

  client.subscribe(topic, (err) => {
    if (err) {
      console.error(`Failed to subscribe to ${topic}:`, err);
    } else {
      console.log(`Subscribed to ${topic}`);
    }
  });
}

/**
 * Optional helper if you later add device commands.
 */
function publish(topic, message) {
  if (!client) {
    throw new Error("MQTT client has not been initialized.");
  }

  client.publish(topic, message);
}

module.exports = {
  initialize,
  subscribe,
  publish,
};