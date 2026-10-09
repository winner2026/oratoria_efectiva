import { PGlite } from '@electric-sql/pglite';

async function test() {
  const db = new PGlite();
  
  // Create tables
  await db.exec(`
    CREATE TABLE IF NOT EXISTS voice_sessions (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id TEXT NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      transcription TEXT NOT NULL,
      transcription_with_silences TEXT NOT NULL,
      words_per_minute INT NOT NULL,
      avg_pause_duration NUMERIC(5, 2) NOT NULL,
      pause_count INT NOT NULL,
      filler_count INT NOT NULL,
      pitch_variation NUMERIC(5, 2) NOT NULL,
      energy_stability NUMERIC(5, 2) NOT NULL,
      duration_seconds NUMERIC(6, 2) NOT NULL,
      authority_level TEXT NOT NULL,
      authority_score INT NOT NULL,
      strengths JSONB NOT NULL,
      weaknesses JSONB NOT NULL,
      priority_adjustment TEXT NOT NULL,
      feedback_diagnostico TEXT NOT NULL,
      feedback_lo_que_suma JSONB NOT NULL,
      feedback_lo_que_resta JSONB NOT NULL,
      feedback_decision TEXT NOT NULL,
      feedback_payoff TEXT NOT NULL
    );
  `);

  console.log("✅ PGLite PostgreSQL table 'voice_sessions' created successfully!");

  // Insert a test session
  const res = await db.query(`
    INSERT INTO voice_sessions (
      user_id, transcription, transcription_with_silences, words_per_minute,
      avg_pause_duration, pause_count, filler_count, pitch_variation, energy_stability,
      duration_seconds, authority_level, authority_score, strengths, weaknesses,
      priority_adjustment, feedback_diagnostico, feedback_lo_que_suma, feedback_lo_que_resta,
      feedback_decision, feedback_payoff
    ) VALUES (
      'visitor-test-123', 'Audio grabado real', '[0.8s] Audio', 125,
      0.80, 4, 1, 85.00, 99.00, 15.00, 'HIGH', 85, '["Consistencia vocal"]', '[]',
      'PAUSE_MORE', 'Diagnóstico excelente', '["Firmeza"]', '[]', 'Mantener ritmo', 'Mayor autoridad'
    ) RETURNING id, user_id, authority_score, created_at;
  `);

  console.log("✅ Inserted session into PGLite DB:", res.rows[0]);

  // Query back
  const fetchRes = await db.query(`SELECT * FROM voice_sessions WHERE user_id = 'visitor-test-123'`);
  console.log(`✅ Retrieved ${fetchRes.rows.length} session(s) from PGLite DB for visitor-test-123.`);
}

test().catch(console.error);
