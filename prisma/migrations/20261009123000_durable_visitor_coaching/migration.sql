-- Los análisis usan visitor_id incluso si no existe una cuenta autenticada.
-- El vínculo obligatorio a users impedía guardar sesiones de visitantes anónimos.
ALTER TABLE "voice_sessions" DROP CONSTRAINT IF EXISTS "voice_sessions_user_id_fkey";

CREATE TABLE "visitor_coaching_states" (
  "visitor_id" TEXT NOT NULL,
  "state" JSONB NOT NULL,
  "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "visitor_coaching_states_pkey" PRIMARY KEY ("visitor_id")
);

CREATE TABLE "coaching_records" (
  "id" TEXT NOT NULL,
  "visitor_id" TEXT NOT NULL,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "payload" JSONB NOT NULL,
  CONSTRAINT "coaching_records_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "coaching_records_visitor_id_created_at_idx"
  ON "coaching_records"("visitor_id", "created_at" DESC);
