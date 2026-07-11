const dotenv = require("dotenv");

dotenv.config();

module.exports = {
    port: process.env.PORT,
    mongoUri: process.env.MONGO_URI,
    mqttUrl: process.env.MQTT_URL,
    corsOrigin: process.env.CORS_ORIGIN,
};

// can access process.env now