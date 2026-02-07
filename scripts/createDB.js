require("dotenv").config();
const rootPool = require("../config/rootdb"); 

(async () => {
  try {
    const dbName = process.env.DB_NAME;

    console.log(`Checking database '${dbName}'...`);

    const check = await rootPool.query(
      `SELECT 1 FROM pg_database WHERE datname = $1`,
      [dbName]
    );

    if (check.rowCount === 0) {
      await rootPool.query(`CREATE DATABASE ${dbName}`);
      console.log(`Database '${dbName}' successfully created.`);
    } else {
      console.log(`Database '${dbName}' already exists.`);
    }

  } catch (err) {
    console.error("Error creating database:", err.message);
  } finally {
    await rootPool.end();
  }
})();
