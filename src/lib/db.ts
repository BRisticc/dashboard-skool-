import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

// We fall back to empty string if not provided so build doesn't crash, 
// but it will fail on runtime if actual db calls are made.
const sql = neon(process.env.DATABASE_URL || "postgres://user:pass@localhost/db");
export const db = drizzle(sql);
