/**
 * SCHEMA DE BASE DE DATOS - KREDIA MVP
 *
 * Diseño basado en Clean Architecture:
 * - El dominio manda; la base de datos es un detalle técnico
 * - Schema se adapta a las entidades, NO al revés
 * - Sin sobreingeniería, preparado para crecer
 *
 * NeonDB / PostgreSQL
 */

export const schema = {
  credit_cards: `
    CREATE TABLE IF NOT EXISTS credit_cards (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name TEXT NOT NULL,
      balance NUMERIC(12,2) NOT NULL,
      statement_date DATE NOT NULL,
      due_date DATE NOT NULL,
      interest_rate_monthly NUMERIC(5,4) NOT NULL DEFAULT 0.07,
      created_at TIMESTAMP DEFAULT now(),
      updated_at TIMESTAMP DEFAULT now()
    );
  `,

  transactions: `
    CREATE TABLE IF NOT EXISTS transactions (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      credit_card_id UUID NOT NULL REFERENCES credit_cards(id) ON DELETE CASCADE,
      amount NUMERIC(12,2) NOT NULL,
      date DATE NOT NULL,
      description TEXT,
      type TEXT NOT NULL CHECK (type IN ('NORMAL', 'MSI')),
      created_at TIMESTAMP DEFAULT now(),
      updated_at TIMESTAMP DEFAULT now()
    );
  `,

  msi_plans: `
    CREATE TABLE IF NOT EXISTS msi_plans (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      transaction_id UUID NOT NULL REFERENCES transactions(id) ON DELETE CASCADE,
      total_amount NUMERIC(12,2) NOT NULL,
      months INT NOT NULL,
      monthly_payment NUMERIC(12,2) NOT NULL,
      start_date DATE NOT NULL,
      remaining_months INT NOT NULL,
      created_at TIMESTAMP DEFAULT now(),
      updated_at TIMESTAMP DEFAULT now()
    );
  `
}

/**
 * RELACIONES:
 * - 1 tarjeta → muchas transacciones
 * - 1 transacción MSI → 1 plan MSI
 * - 1 plan MSI → pertenece SOLO a una transacción
 *
 * VENTAJAS:
 * - Representa EXACTAMENTE las entidades del dominio
 * - Nada sobra, nada falta
 * - No limita el dominio (reglas de negocio en /core)
 * - Escala fácil (transferencias, pagos, sync bancaria en V2+)
 * - NUMERIC con 2 decimales asegura precisión financiera
 */

export async function initializeSchema(queryFn: (sql: string) => Promise<any>) {
  for (const [tableName, sql] of Object.entries(schema)) {
    await queryFn(sql)
  }
}
