import { Pool } from "pg";
import dotenv from  'dotenv';


dotenv.config();


const pool = new Pool({
  connectionString: process.env.DATABASE_URL,

  // OR
  // host: process.env.DB_HOST,
  // port: parseInt(process.env.DB_PORT || '5432'),
  // user: process.env.DB_USER,
  // password:  process.env.DB_PASSWORD,
  // database:  process.env.DB_DATABASE
});

export default pool;