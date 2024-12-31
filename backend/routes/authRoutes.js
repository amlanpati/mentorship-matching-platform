const express = require("express");
const { registerUser, loginUser } = require("../controllers/authController");
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", (req, res) => {
  // Invalidate the token if necessary
  res.status(200).json({ message: "Logout successful" });
});

module.exports = router;
