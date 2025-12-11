-- MIGRACIÓN INICIAL - KREDIA MVP
-- Base de datos: NeonDB / PostgreSQL
-- Fecha: 2025-01-10

-- =============================================================================
-- TABLA: credit_cards
-- =============================================================================
-- Almacena las tarjetas de crédito del usuario
CREATE TABLE IF NOT EXISTS credit_cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,                       -- Ej: "BBVA", "Santander"
  balance NUMERIC(12,2) NOT NULL,           -- Saldo reportado
  statement_date DATE NOT NULL,             -- Fecha de corte
  due_date DATE NOT NULL,                   -- Fecha límite de pago
  interest_rate_monthly NUMERIC(5,4) NOT NULL DEFAULT 0.07,  -- 7% mensual default
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- =============================================================================
-- TABLA: transactions
-- =============================================================================
-- Almacena todas las transacciones (compras normales y MSI)
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

-- =============================================================================
-- TABLA: msi_plans
-- =============================================================================
-- Almacena los planes de Meses Sin Intereses
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

-- =============================================================================
-- ÍNDICES
-- =============================================================================
-- Optimizar consultas frecuentes

-- Transacciones por tarjeta (query más común)
CREATE INDEX IF NOT EXISTS idx_transactions_credit_card_id
ON transactions(credit_card_id);

-- Transacciones por fecha (para filtros de rango)
CREATE INDEX IF NOT EXISTS idx_transactions_date
ON transactions(date DESC);

-- MSI por transacción
CREATE INDEX IF NOT EXISTS idx_msi_plans_transaction_id
ON msi_plans(transaction_id);

-- =============================================================================
-- COMENTARIOS DE DOCUMENTACIÓN
-- =============================================================================

COMMENT ON TABLE credit_cards IS 'Tarjetas de crédito del usuario';
COMMENT ON TABLE transactions IS 'Compras normales y MSI';
COMMENT ON TABLE msi_plans IS 'Planes de Meses Sin Intereses asociados a transacciones';

COMMENT ON COLUMN credit_cards.balance IS 'Saldo actual de la tarjeta';
COMMENT ON COLUMN credit_cards.statement_date IS 'Fecha de corte del estado de cuenta';
COMMENT ON COLUMN credit_cards.due_date IS 'Fecha límite de pago';
COMMENT ON COLUMN credit_cards.interest_rate_monthly IS 'Tasa de interés mensual (ej: 0.07 = 7%)';

COMMENT ON COLUMN transactions.type IS 'Tipo de transacción: NORMAL o MSI';
COMMENT ON COLUMN msi_plans.remaining_months IS 'Meses restantes del plan MSI';
