CREATE TABLE IF NOT EXISTS credit_cards (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  balance NUMERIC(12, 2) NOT NULL DEFAULT 0,
  statement_date DATE NOT NULL,
  due_date DATE NOT NULL,
  interest_rate_monthly NUMERIC(5, 4) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
