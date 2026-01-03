import { db } from './src/infrastructure/db/client';

async function checkUsage() {
  try {
    console.log('📊 Consultando tabla usage...\n');

    const result = await db.query(`
      SELECT
        user_id,
        total_analyses,
        plan_type,
        created_at,
        updated_at
      FROM usage
      ORDER BY updated_at DESC
      LIMIT 10
    `);

    if (result.rows.length === 0) {
      console.log('⚠️  La tabla usage está vacía - no hay usuarios registrados');
    } else {
      console.log(`✓ Encontrados ${result.rows.length} registros:\n`);
      result.rows.forEach((row: any, idx: number) => {
        console.log(`${idx + 1}. User: ${row.user_id.substring(0, 20)}...`);
        console.log(`   Análisis: ${row.total_analyses}`);
        console.log(`   Plan: ${row.plan_type}`);
        console.log(`   Última actualización: ${new Date(row.updated_at).toLocaleString()}`);
        console.log('');
      });

      // Estadísticas
      const statsResult = await db.query(`
        SELECT total_analyses, COUNT(*) as count
        FROM usage
        GROUP BY total_analyses
        ORDER BY total_analyses
      `);

      console.log('📈 Distribución de análisis:');
      statsResult.rows.forEach((row: any) => {
        console.log(`   ${row.total_analyses} análisis: ${row.count} usuarios`);
      });
    }

    // Prisma handles connection cleanup automatically
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

checkUsage();
