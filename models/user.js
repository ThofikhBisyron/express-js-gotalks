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
  const query = `SELECT * FROM user_otp WHERE user_id = $1 ORDER BY created_at DESC LIMIT 1`
  const result = await pool.query(query, [userId])
  return result.rows[0] 
}

const getUserById = async (userId) => {
  const result = await pool.query(`SELECT id, username, phone_number, email, image, image_background, description FROM users WHERE id = $1`, [userId])
  return result.rows[0]
};

const verifyUser = async (userId) => {
  await pool.query(`UPDATE users SET is_verified = TRUE WHERE id = $1`, [userId])
}
const deleteOtpByUserId = async (userId) => {
  await pool.query(`DELETE FROM user_otp WHERE user_id = $1`, [userId])
}

const updateUserNameById = async (username, userId) => {
  const query = `UPDATE users SET username = $1 WHERE id = $2 RETURNING username`
  const result = await pool.query(query, [username, userId])
  return result.rows[0]
}

const updateImageUser = async (Image, userId) => {
  const query = `UPDATE users SET image = $1 WHERE id = $2 RETURNING image`
  const result = await pool.query(query, [Image, userId])
  return result.rows[0]
}

const updateImgBgUser = async (imgBg, userId) => {
  const query = `UPDATE users SET image_background = $1 WHERE id = $2 RETURNING image_background`
  const result = await pool.query(query, [imgBg, userId])
  return result.rows[0]
}

module.exports = { createUser, 
  getUserByEmail, 
  createOtp, 
  getOtpByUserId, 
  deleteOtpByUserId, 
  verifyUser, 
  updateUserNameById, 
  getUserById, 
  updateImageUser,
  updateImgBgUser, };
