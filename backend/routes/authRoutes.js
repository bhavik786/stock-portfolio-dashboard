// routes/authRoutes.js
const express = require("express");
const { register, login } = require("../controllers/authController");
const router = express.Router();

router.post("/register", register);
router.post("/login", login);

router.get("/test", (req, res) => {
  return res.json({ status: true, message: "Server is working....!" });
});

module.exports = router;
