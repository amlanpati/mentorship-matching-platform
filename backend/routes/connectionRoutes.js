const express = require("express");
const {
  sendConnectionRequest,
  fetchConnectionRequests,
  acceptOrDeclineRequest,
  fetchActiveConnections,
} = require("../controllers/connectionController");

const router = express.Router();

// Route to send a connection request
router.post("/send", sendConnectionRequest);

// Route to fetch incoming connection requests
router.get("/requests", fetchConnectionRequests);

// Route to accept or decline a connection request
router.post("/handle", acceptOrDeclineRequest);
router.post("");

// Route to fetch active connections
router.get("/active", fetchActiveConnections);

module.exports = router;
