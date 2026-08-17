import mysql from 'mysql2';
import dotenv from 'dotenv';
dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'kasaija_lawfirm',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export const promisePool = pool.promise();
export default pool;
