const pool = require("../db/db");

const createOrUpdateProfile = async (req, res) => {
  const { role, skills, interests, bio } = req.body;
  const userId = req.user.userId;

  try {
    const result = await pool.query(
      `UPDATE users
       SET role = $1, skills = $2, interests = $3, bio = $4, updated_at = NOW()
       WHERE id = $5
       RETURNING *`,
      [role, skills, interests, bio, userId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "User not found." });
    }

    res.status(200).json({ profile: result.rows[0] });
  } catch (error) {
    console.error("Error creating/updating profile:", error);
    res.status(500).json({ error: "Error saving profile." });
  }
};

const getProfiles = async (req, res) => {
  const { role, skills, interests } = req.query;

  try {
    let query = "SELECT * FROM users WHERE 1=1";
    const params = [];

    if (role) {
      query += " AND role = $1";
      params.push(role);
    }
    if (skills) {
      query += ` AND skills ILIKE $${params.length + 1}`;
      params.push(`%${skills}%`);
    }
    if (interests) {
      query += ` AND interests ILIKE $${params.length + 1}`;
      params.push(`%${interests}%`);
    }

    const result = await pool.query(query, params);
    res.status(200).json({ profiles: result.rows });
  } catch (error) {
    console.error("Error fetching profiles:", error);
    res.status(500).json({ error: "Error fetching profiles." });
  }
};

const deleteProfile = async (req, res) => {
  try {
    const userId = req.headers["x-user-id"];
    // Check if the user exists
    const userCheck = await pool.query("SELECT * FROM users WHERE id = $1", [
      userId,
    ]);
    if (userCheck.rowCount === 0) {
      return res.status(404).json({ error: "User not found." });
    }

    // Delete user from the database
    await pool.query("DELETE FROM users WHERE id = $1", [userId]);

    res.status(200).json({ message: "Account deleted successfully." });
  } catch (error) {
    console.error("Error deleting account:", error);
    res
      .status(500)
      .json({ error: "Failed to delete account. Please try again later." });
  }
};

module.exports = { createOrUpdateProfile, getProfiles, deleteProfile };
