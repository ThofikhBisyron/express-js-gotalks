const pool = require('../config/db');

const upQuery = `
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(100) NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password TEXT NOT NULL,
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
