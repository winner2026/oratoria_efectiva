-- Migration: Create events table for behavioral tracking
-- This table stores verified user actions, not analytics

CREATE TABLE IF NOT EXISTS events (
  id SERIAL PRIMARY KEY,
  user_id TEXT NOT NULL,
  event TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Index for querying events by user
CREATE INDEX IF NOT EXISTS idx_events_user_id ON events(user_id);

-- Index for querying events by type
CREATE INDEX IF NOT EXISTS idx_events_event ON events(event);

-- Index for time-based queries
CREATE INDEX IF NOT EXISTS idx_events_created_at ON events(created_at);

-- Composite index for user + event type queries
CREATE INDEX IF NOT EXISTS idx_events_user_event ON events(user_id, event);

-- Comments
COMMENT ON TABLE events IS 'Behavioral events - verified user actions, not opinions';
COMMENT ON COLUMN events.user_id IS 'User identifier (from localStorage or auth)';
COMMENT ON COLUMN events.event IS 'Event name (recording_started, analysis_viewed, etc)';
COMMENT ON COLUMN events.metadata IS 'Event-specific data (duration, section, etc)';
COMMENT ON COLUMN events.created_at IS 'When the event occurred';
