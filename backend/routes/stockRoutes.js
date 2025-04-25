// routes/stockRoutes.js
const express = require("express");
const {
  addStock,
  getPortfolio,
  updateStock,
  deleteStock,
} = require("../controllers/stockController");
const auth = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/add", auth, addStock);
router.get("/portfolio", auth, getPortfolio);
router.put("/:id", auth, updateStock);
router.delete("/:id", auth, deleteStock);

module.exports = router;
