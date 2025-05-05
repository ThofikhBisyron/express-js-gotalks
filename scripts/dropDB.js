const pool = require('../config/db');

const downQuery = `
DROP TABLE IF EXISTS messages;
DROP TABLE IF EXISTS group_members;
DROP TABLE IF EXISTS contacts;
DROP TABLE IF EXISTS user_otp;
DROP TABLE IF EXISTS groups;
DROP TABLE IF EXISTS users;

`;

(async () => {
  try {
    await pool.query(downQuery);
    console.log("All tables successfully deleted");
  } catch (err) {
    console.error("Failed to delete table:", err.message);
  } finally {
    pool.end();
  }
})();
