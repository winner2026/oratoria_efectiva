-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "role" TEXT,
    "goal" TEXT,
    "credits" INTEGER NOT NULL DEFAULT 3,
    "plan" TEXT NOT NULL DEFAULT 'FREE',
    "magicToken" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "usage" (
    "id" TEXT NOT NULL,
    "user_id" TEXT,
    "fingerprint" TEXT NOT NULL,
    "plan_type" TEXT NOT NULL DEFAULT 'FREE',
    "total_analyses" INTEGER NOT NULL DEFAULT 0,
    "last_analysis_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "usage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "voice_sessions" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "transcription" TEXT NOT NULL,
    "transcription_with_silences" TEXT NOT NULL,
    "words_per_minute" INTEGER NOT NULL,
    "avg_pause_duration" DECIMAL(5,2) NOT NULL,
    "pause_count" INTEGER NOT NULL,
    "filler_count" INTEGER NOT NULL,
    "pitch_variation" DECIMAL(5,2) NOT NULL,
    "energy_stability" DECIMAL(5,2) NOT NULL,
    "duration_seconds" DECIMAL(6,2) NOT NULL,
    "authority_level" TEXT NOT NULL,
    "authority_score" INTEGER NOT NULL,
    "strengths" JSONB NOT NULL,
    "weaknesses" JSONB NOT NULL,
    "priority_adjustment" TEXT NOT NULL,
    "feedback_diagnostico" TEXT NOT NULL,
    "feedback_lo_que_suma" JSONB NOT NULL,
    "feedback_lo_que_resta" JSONB NOT NULL,
    "feedback_decision" TEXT NOT NULL,
    "feedback_payoff" TEXT NOT NULL,

    CONSTRAINT "voice_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_magicToken_key" ON "User"("magicToken");

-- CreateIndex
CREATE UNIQUE INDEX "usage_user_id_key" ON "usage"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "usage_fingerprint_key" ON "usage"("fingerprint");

-- CreateIndex
CREATE INDEX "voice_sessions_user_id_idx" ON "voice_sessions"("user_id");

-- CreateIndex
CREATE INDEX "voice_sessions_created_at_idx" ON "voice_sessions"("created_at" DESC);

-- AddForeignKey
ALTER TABLE "usage" ADD CONSTRAINT "usage_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "voice_sessions" ADD CONSTRAINT "voice_sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
