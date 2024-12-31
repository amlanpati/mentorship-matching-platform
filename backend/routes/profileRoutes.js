const express = require("express");
const {
  createOrUpdateProfile,
  getProfiles,
  deleteProfile,
} = require("../controllers/profileController");
const verifyToken = require("../middleware/authMiddleware");

const router = express.Router();

// Profile routes
router.post("/profile", verifyToken, createOrUpdateProfile);
router.get("/discover", verifyToken, getProfiles);
router.delete("/delete", verifyToken, deleteProfile);

module.exports = router;
