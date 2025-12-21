/**
 * Script to run database migrations
 *
 * Usage: npm run migrate
 */

import { Pool } from "@neondatabase/serverless";
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";
import { config } from "dotenv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env.local
config({ path: path.join(__dirname, "../.env.local") });

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set in .env.local");
}

const db = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function runMigration() {
  const migrations = [
    "003_create_usage_table.sql",
    "004_create_events_table.sql",
  ];

  for (const migrationFile of migrations) {
    const migrationPath = path.join(__dirname, "../migrations", migrationFile);

    if (!fs.existsSync(migrationPath)) {
      console.log(`⏭️  Skipping ${migrationFile} (already run or doesn't exist)`);
      continue;
    }

    const sql = fs.readFileSync(migrationPath, "utf-8");

    console.log(`🔄 Running migration: ${migrationFile}`);

    try {
      await db.query(sql);
      console.log(`✅ ${migrationFile} completed successfully!`);
    } catch (error) {
      console.error(`❌ ${migrationFile} failed:`, error);
      throw error;
    }
  }

  await db.end();
  console.log("✅ All migrations completed!");
}

runMigration();
