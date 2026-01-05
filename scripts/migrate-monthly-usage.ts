// scripts/migrate-monthly-usage.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function migrate() {
  console.log('Running monthly usage migration...');
  
  try {
    // Add columns if they don't exist
    await prisma.$executeRawUnsafe(`
      ALTER TABLE usage 
      ADD COLUMN IF NOT EXISTS monthly_analyses INTEGER DEFAULT 0,
      ADD COLUMN IF NOT EXISTS month_start TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    `);
    console.log('✓ Added monthly columns to usage table');

    // Create index
    await prisma.$executeRawUnsafe(`
      CREATE INDEX IF NOT EXISTS idx_usage_month_start ON usage(month_start)
    `);
    console.log('✓ Created index for month_start');

    console.log('Migration complete!');
  } catch (error) {
    console.error('Migration error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

migrate();
