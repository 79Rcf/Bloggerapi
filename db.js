import pkg from "pg";
const { Pool } = pkg;

const pool = new Pool({
  user: "killian_user",       // PostgreSQL username
  host: "localhost",           // usually localhost
  database: "testbackend",     // database name
  password: "1234",            // PostgreSQL password
  port: 5432
});

export default pool;
