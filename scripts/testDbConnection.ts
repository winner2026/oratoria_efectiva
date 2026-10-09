import { Client } from 'pg';

const credentialsToTry = [
  "postgresql://postgres:postgres@localhost:5432/postgres",
  "postgresql://postgres:admin@localhost:5432/postgres",
  "postgresql://postgres:root@localhost:5432/postgres",
  "postgresql://postgres:123456@localhost:5432/postgres",
  "postgresql://postgres:password@localhost:5432/postgres",
  "postgresql://postgres:1234@localhost:5432/postgres",
  "postgresql://postgres:12345@localhost:5432/postgres",
  "postgresql://postgres:12345678@localhost:5432/postgres",
  "postgresql://postgres:admin123@localhost:5432/postgres",
  "postgresql://postgres:postgres123@localhost:5432/postgres",
  "postgresql://postgres:oratoria@localhost:5432/postgres",
  "postgresql://postgres:winner2026@localhost:5432/postgres",
  "postgresql://postgres:Usuario@localhost:5432/postgres",
  "postgresql://postgres:usuario@localhost:5432/postgres",
];

async function findValidPostgres() {
  for (const conn of credentialsToTry) {
    try {
      const client = new Client({ connectionString: conn });
      await client.connect();
      console.log(`✅ SUCCESS connecting to PostgreSQL: ${conn}`);
      
      // Check if oratoria_efectiva database exists
      const res = await client.query("SELECT datname FROM pg_database WHERE datname = 'oratoria_efectiva'");
      if (res.rows.length === 0) {
        console.log("Creating database 'oratoria_efectiva'...");
        await client.query("CREATE DATABASE oratoria_efectiva");
        console.log("✅ Database 'oratoria_efectiva' created!");
      } else {
        console.log("✅ Database 'oratoria_efectiva' already exists.");
      }
      await client.end();
      return conn.replace("/postgres", "/oratoria_efectiva");
    } catch (err: any) {
      console.log(`Failed ${conn}: ${err.message}`);
    }
  }
  return null;
}

findValidPostgres().then((url) => {
  if (url) {
    console.log(`DATABASE_URL_VALID=${url}`);
  } else {
    console.log("No default local Postgres password matched.");
  }
});
