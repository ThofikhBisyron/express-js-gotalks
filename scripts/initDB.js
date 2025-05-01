const pool = require('../config/db');

const upQuery = `
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(100) NULL,
  phone_number VARCHAR(15) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS user_otp (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id) ON DELETE CASCADE,
  otp_code VARCHAR(4) NOT NULL,
  expired_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


`;

(async () => {
  try {
    await pool.query(upQuery);
    console.log("All tables are created successfully");
  } catch (err) {
    console.error("Failed to create table:", err.message);
  } finally {
    pool.end();
  }
})();
