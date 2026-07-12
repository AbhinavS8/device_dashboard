module.exports = function validateTelemetryRequest(req, res, next) {
  const { topic } = req.params;

  // Validate topic
  if (!topic || typeof topic !== "string") {
    return res.status(400).json({
      error: "Topic is required.",
    });
  }

  // Allow letters, numbers, /, -, _
  const topicRegex = /^[A-Za-z0-9/_-]+$/;

  if (!topicRegex.test(topic)) {
    return res.status(400).json({
      error: "Invalid topic.",
    });
  }

  // Validate limit (optional)
  let limit = 100;

  if (req.query.limit !== undefined) {
    limit = Number(req.query.limit);

    if (
      !Number.isInteger(limit) ||
      limit < 1 ||
      limit > 1000
    ) {
      return res.status(400).json({
        error: "limit must be an integer between 1 and 1000.",
      });
    }
  }

  // Make validated values available to the controller
  req.validated = {
    topic,
    limit,
  };

  next();
};