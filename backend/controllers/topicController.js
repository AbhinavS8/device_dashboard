const telemetryService = require("../services/telemetryService");

// API endpoint to get data for a topic
module.exports.getTopicHistory = async (req, res) => {
    // const topic = req.params.topic;
    // const limit = parseInt(req.query.limit) || 100;
    // Get last entries for the topic
    const { topic, limit } = req.validated;
    const data = await telemetryService.getTopicHistory(topic, limit);
    res.json(data);
};

// API endpoint to get all available topics
module.exports.getTopics = async (req, res) => {
  try {
    const topics = await telemetryService.getTopics();
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
    const count = await telemetryService.getTopicCount(topic);
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
    res.json(await telemetryService.cleanupTopic(topic, keepLast));
  } catch (err) {
    console.error("Error cleaning up topic data:", err);
    res.status(500).json({ error: "Failed to cleanup topic data" });
  }
}