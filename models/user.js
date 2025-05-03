const pool = require('../config/db');

const createUser = async (email, phone_number) => {
  const query = `INSERT INTO users (email, phone_number) VALUES ($1, $2) RETURNING *`
  const result = await pool.query(query, [email, phone_number])
  return result.rows[0]
};

const createOtp = async (userId, otp, expired = 5) => {
  const expiredAt = new Date(Date.now() + expired * 60 * 1000)
  const query = `INSERT INTO user_otp (user_id, otp_code, expired_at) VALUES ($1, $2, $3) RETURNING *`
  const result = await pool.query(query, [userId, otp, expiredAt])
  return result.rows[0]
}

const getUserByEmail = async (email) => {
  const result = await pool.query(`SELECT * FROM users WHERE email = $1`, [email])
  return result.rows[0]
};
const getOtpByUserId = async (userId) => {
  const query = `SELECT FROM user_otp WHERE user_id = $1 ORDER BY created_at DESC LIMIT 1`
  const result = await pool.query(query, [userId])
  return result.rows[0] 
}

const deleteOtpByUserId = async (userId) => {
  await pool.query(`DELETE FROM user_otp WHERE user_id = $1`, [userId])
}


module.exports = { createUser, getUserByEmail, createOtp, getOtpByUserId, deleteOtpByUserId };
