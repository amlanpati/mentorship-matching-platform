const pool = require("../db/db"); // Assuming you're using PostgreSQL with a pool

// Send a connection request
exports.sendConnectionRequest = async (req, res) => {
  try {
    const { sender_id, receiver_id } = req.body;

    if (!sender_id || !receiver_id) {
      return res
        .status(400)
        .json({ error: "Both sender_id and receiver_id are required" });
    }

    if (sender_id === receiver_id) {
      return res
        .status(400)
        .json({ error: "You cannot send a connection request to yourself." });
    }

    // Check for existing pending requests
    const existingRequest = await pool.query(
      `SELECT * FROM connections 
         WHERE 
           (sender_id = $1 AND receiver_id = $2) 
           OR (sender_id = $2 AND receiver_id = $1) 
           AND status = 'pending'`,
      [sender_id, receiver_id]
    );

    // Check for existing pending requests
    const existingConnection = await pool.query(
      `SELECT * FROM connections 
           WHERE 
             (sender_id = $1 AND receiver_id = $2) 
             OR (sender_id = $2 AND receiver_id = $1) 
             AND status = 'accepted'`,
      [sender_id, receiver_id]
    );

    if (existingRequest.rows.length > 0) {
      return res
        .status(400)
        .json({ error: "A connection request is already pending." });
    }

    if (existingConnection.rows.length > 0) {
      return res
        .status(400)
        .json({ error: "Already connected to this person." });
    }

    // Insert the new request

    await pool.query(
      "INSERT INTO connections (sender_id, receiver_id) VALUES ($1, $2)",
      [sender_id, receiver_id]
    );
    res.status(201).json({ message: "Connection request sent successfully" });
  } catch (error) {
    console.error("Error sending connection request:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Fetch incoming connection requests
exports.fetchConnectionRequests = async (req, res) => {
  try {
    const { user_id } = req.query;
    if (!user_id) {
      return res
        .status(400)
        .json({ error: "User ID is required in query parameters." });
    }

    const result = await pool.query(
      "SELECT users.name, connections.id, to_char(connections.created_at AT TIME ZONE 'UTC' AT TIME ZONE 'UT', 'HH24:MI, DD-MM-YY') AS friendly_created_at FROM users JOIN connections ON users.id = connections.sender_id WHERE receiver_id = $1 AND status = 'pending'",
      [user_id]
    );
    res.status(200).json({ requestsReceived: result.rows });
  } catch (error) {
    console.error("Error fetching connection requests:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Accept or decline a connection request
exports.acceptOrDeclineRequest = async (req, res) => {
  try {
    const { connection_id, action } = req.body;

    if (!connection_id || !action) {
      return res
        .status(400)
        .json({ error: "connection_id and action are required" });
    }

    if (action !== "accept" && action !== "decline") {
      return res.status(400).json({ error: "Invalid action" });
    }

    if (action === "accept") {
      // Update the status to "accepted" for accepted requests
      await pool.query("UPDATE connections SET status = $1 WHERE id = $2", [
        "accepted",
        connection_id,
      ]);
    } else if (action === "decline") {
      // Delete the row for declined requests
      await pool.query("DELETE FROM connections WHERE id = $1", [
        connection_id,
      ]);
    }

    res
      .status(200)
      .json({ success: true, message: `Request ${action}ed successfully` });
  } catch (error) {
    console.error("Error handling connection request:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Fetch active connections
exports.fetchActiveConnections = async (req, res) => {
  try {
    const { user_id } = req.query;
    if (!user_id) {
      return res
        .status(400)
        .json({ error: "User ID is required in query parameters." });
    }
    const result = await pool.query(
      "SELECT users.name, users.role, connections.id FROM users JOIN connections ON users.id = connections.sender_id WHERE (sender_id = $1 OR receiver_id = $1) AND status = 'accepted'",
      [user_id]
    );
    res.status(200).json({ connections: result.rows });
  } catch (error) {
    console.error("Error fetching active connections:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
