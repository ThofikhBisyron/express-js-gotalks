const pool = require('../config/db');

const createUser = async (email, password) => {
  const query = `INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *`;
  const result = await pool.query(query, [email, password]);
  return result.rows[0];
};

const getUserByEmail = async (email) => {
  const result = await pool.query(`SELECT * FROM users WHERE email = $1`, [email]);
  return result.rows[0];
};

module.exports = { createUser, getUserByEmail };
