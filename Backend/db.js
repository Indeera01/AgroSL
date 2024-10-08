const Pool = require("pg").Pool;
require("dotenv").config({ path: "../.env" });

// const pool = new Pool({
//   user: "postgres",
//   password: process.env.DB_PASSWORD,
//   host: "localhost",
//   port: 5432,
//   database: "AgroSl_Latest",
// });

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
});

module.exports = pool;
