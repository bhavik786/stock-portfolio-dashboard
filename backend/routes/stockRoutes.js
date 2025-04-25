// routes/stockRoutes.js
const express = require("express");
const {
  addStock,
  getPortfolio,
  updateStock,
} = require("../controllers/stockController");
const auth = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/add", auth, addStock);
router.get("/portfolio", auth, getPortfolio);
router.put("/:id", auth, updateStock);

module.exports = router;
