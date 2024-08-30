const Pool = require("pg").Pool;

const pool = new Pool({
  user: "postgres",
  password: "AgroSl21",
  host: "localhost",
  port: 5432,
  database: "agrosl",
});

module.exports = pool;
