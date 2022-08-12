import { Pool } from "pg";

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "note",
  password: "pass123",
  port: 5432,
});

export default pool;
