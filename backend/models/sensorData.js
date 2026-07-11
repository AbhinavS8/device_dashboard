const mongoose = require("mongoose");

const sensorDataSchema = new mongoose.Schema(
  {
    topic: {
      type: String,
      required: true,
      index: true,
    },
    data: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    versionKey: false,
  }
);
const SensorData = mongoose.model("SensorData", sensorDataSchema);

module.exports = SensorData;