const { Pool } = require("pg");

const pool = new Pool({
  user: "pranithasanka",
  host: "localhost",
  database: "video_db",
  password: "password123",
  port: 5432
});

module.exports = pool;

