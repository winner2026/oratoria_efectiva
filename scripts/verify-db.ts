import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log("=== INICIANDO VERIFICACIÓN DE BASE DE DATOS DE PREVIEW ===");
  console.log(`URL conectada: ${process.env.DATABASE_URL?.split('@')[1] || 'No especificada'}`);

  try {
    console.log("\n1. Verificando Nulabilidad en voice_sessions...");
    const columns = await prisma.$queryRaw`
      SELECT column_name, is_nullable 
      FROM information_schema.columns 
      WHERE table_schema = 'public' 
      AND table_name = 'voice_sessions' 
      AND column_name IN ('pitch_variation', 'energy_stability');
    `;
    console.table(columns);

    console.log("\n2. Verificando Existencia de Tablas Nuevas...");
    const tables = await prisma.$queryRaw`
      SELECT 
        to_regclass('public.visitor_coaching_states') AS coaching_state_table, 
        to_regclass('public.coaching_records') AS coaching_records_table;
    `;
    console.table(tables);

  } catch (error) {
    console.error("❌ Error verificando la base de datos:", error);
  } finally {
    await prisma.$disconnect();
    console.log("\n=== VERIFICACIÓN COMPLETADA ===");
  }
}

main();
