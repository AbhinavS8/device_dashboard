const SensorData = require("../models/sensorData");


// API endpoint to get data for a topic
module.exports.getTopicHistory = async (req, res) => {
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
};

// API endpoint to get all available topics
module.exports.getTopics = async (req, res) => {
  try {
    const topics = await SensorData.distinct("topic");
    res.json(topics);
  } catch (err) {
    console.error("Error fetching topics:", err);
    res.status(500).json({ error: "Failed to fetch topics" });
  }
};

// API endpoint to get sensor data count for a topic
module.exports.getTopicCount = async (req, res) => {
  try {
    const topic = req.params.topic;
    const count = await SensorData.countDocuments({ topic });
    res.json({ topic, count });
  } catch (err) {
    console.error("Error counting topic data:", err);
    res.status(500).json({ error: "Failed to count topic data" });
  }
}

// API endpoint to delete old data (optional cleanup)
module.exports.cleanupTopic = async (req, res) => {
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
}