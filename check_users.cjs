const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    console.log("🔍 Conectando a NeonDB...");
    
    // Contar total
    const count = await prisma.user.count();
    console.log(`✅ Total de Usuarios Registrados: ${count}`);

    // Listar los últimos 5
    const users = await prisma.user.findMany({
      take: 5,
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        email: true,
        name: true,
        role: true,
        createdAt: true,
        plan: true
      }
    });

    console.log("\n📋 Últimos 5 Registros:");
    console.table(users);

  } catch (e) {
    console.error("❌ Error al consultar:", e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
