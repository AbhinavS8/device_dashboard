const express = require("express");

const SensorData = require("../models/sensorData");
const topicController = require("../controllers/topicController");

const router = express.Router();

router.get(
    "/topic/:topic",
    topicController.getTopicHistory
);

router.get(
    "/topics",
    topicController.getTopics
);

router.get(
    "/topic/:topic/count",
    topicController.getTopicCount
);

router.delete(
    "/topic/:topic/cleanup",
    topicController.cleanupTopic
);

module.exports = router;