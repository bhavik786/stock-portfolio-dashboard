// controllers/adminController.js
const redis = require("../config/redisClient");

exports.clearCache = async (req, res) => {
  try {
    await redis.flushAll(); // This clears everything in Redis
    console.log("🧹 Redis cache cleared manually!");
    res.status(200).json({ message: "Redis cache cleared!" });
  } catch (err) {
    console.error("❌ Failed to clear Redis cache:", err.message);
    res
      .status(500)
      .json({ message: "Failed to clear cache", error: err.message });
  }
};
