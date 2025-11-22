// lib/db.ts
import mysql from "mysql2/promise";

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  waitForConnections: true,
  connectionLimit: 10,
});

export async function dbQuery<T = any>(
  query: string,
  params?: any[]
): Promise<T[]> {
  const [rows] = await pool.query(query, params);
  return rows as T[];
}

// NEU: für INSERT / UPDATE / DELETE
export async function dbExecute(
  query: string,
  params?: any[]
) {
  const [result] = await pool.execute(query, params);
  return result; // kannst du bei INSERT/UPDATE/DELETE ignorieren oder auswerten
}
