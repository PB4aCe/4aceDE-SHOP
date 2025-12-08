import { neon } from "@neondatabase/serverless";

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  throw new Error("DATABASE_URL missing. Did you run `vercel env pull .env.local`?");
}

export const sql = neon(DATABASE_URL);

// ✅ Legacy-Aliase für alten Code
export const dbQuery = sql;
export const dbExecute = sql;
