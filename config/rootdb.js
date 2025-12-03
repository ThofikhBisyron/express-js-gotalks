const { Pool } = require("pg");
require("dotenv").config();

const rootPool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: "postgres", 
});

module.exports = rootPool;
