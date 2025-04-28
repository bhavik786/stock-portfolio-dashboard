// routes/adminRoutes.js
const express = require("express");
const { clearCache } = require("../controllers/adminController");
const router = express.Router();

// No auth for now (optional: add later)
router.post("/clear-cache", clearCache);

module.exports = router;
