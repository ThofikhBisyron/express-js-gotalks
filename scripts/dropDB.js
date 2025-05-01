const pool = require('../config/db');

const downQuery = `
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS user_otp;
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
