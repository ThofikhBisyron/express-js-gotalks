const pool = require('../config/db');

const upQuery = `
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(100) NULL,
  phone_number VARCHAR(15) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  image VARCHAR(255),
  image_background VARCHAR(255),
  description TEXT,
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS user_otp (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id) ON DELETE CASCADE,
  otp_code VARCHAR(4) NOT NULL,
  expired_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS groups (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100),
  image VARCHAR(255),
  description VARCHAR(255),
  created_by INT REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS group_members (
  id SERIAL PRIMARY KEY,
  group_id INT REFERENCES groups(id),
  user_id INT REFERENCES users(id),
  role VARCHAR(6),
  joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
);


CREATE TABLE IF NOT EXISTS messages (
  id SERIAL PRIMARY KEY,
  sender_id INT REFERENCES users(id),
  receiver_id INT REFERENCES users(id),
  group_id INT REFERENCES groups(id),
  content TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS contacts (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id) ON DELETE CASCADE,
  contact_id INT REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE (user_id, contact_id)
);

`;

const insertData = `
INSERT INTO users (username, phone_number, email, is_verified)
VALUES
('raisya', '085870020195', 'syaifania.raisya@gmail.com', true),
('syaifania', '0881082320769', 'raisya.syaifania@gmail.com', true);


`;

(async () => {
  try {
    await pool.query(upQuery)
    console.log("All tables are created successfully")
    await pool.query(insertData)
    console.log("Inserted data successfully")
  } catch (err) {
    console.error("Failed to create table:", err.message)
  } finally {
    pool.end();
  }
})();
