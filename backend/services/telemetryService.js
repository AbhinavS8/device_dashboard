const SensorData = require("../models/sensorData");

async function getTopicHistory(topic, limit) {
    const data = await SensorData
        .find({ topic })
        .sort({ timestamp: -1 })
        .limit(limit);

    return data.reverse();
}

async function getTopics() {
    return SensorData.distinct("topic");
}

async function getTopicCount(topic) {
    return SensorData.countDocuments({ topic });
}

async function cleanupTopic(topic, keepLast) {

    const totalCount = await SensorData.countDocuments({ topic });
    if (totalCount > keepLast) {
      const toDelete = totalCount - keepLast;
      const oldestRecords = await SensorData.find({ topic })
        .sort({ timestamp: 1 })
        .limit(toDelete)
        .select('_id');
      
      const idsToDelete = oldestRecords.map(record => record._id);
      await SensorData.deleteMany({ _id: { $in: idsToDelete } });
      
      return { deleted: toDelete, remaining: keepLast }
    } else {
      return { deleted: 0, remaining: totalCount }
    }
}

module.exports = {
    getTopicHistory,
    getTopics,
    getTopicCount,
    cleanupTopic,
};