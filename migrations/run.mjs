import dotenv from "dotenv";
import fs from "fs";
import { Client } from "pg";

dotenv.config({ path: ".env.local" });

async function runMigration() {
  const sql = fs.readFileSync("./migrations/0001_init.sql", "utf8");

  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });

  await client.connect();
  console.log("🔗 Connected to NeonDB via SSL");

  try {
    await client.query(sql);
    console.log("✅ Migration executed successfully!");
  } catch (err) {
    console.error("❌ Migration error:", err);
  } finally {
    await client.end();
  }
}

runMigration();
