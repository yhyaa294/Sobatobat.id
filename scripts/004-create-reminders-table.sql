-- Create reminders table for medication reminders
CREATE TABLE IF NOT EXISTS reminders (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  medicine_id INTEGER NOT NULL REFERENCES medicines(id) ON DELETE CASCADE,
  time_of_day VARCHAR(5) NOT NULL, -- Format: HH:MM (e.g., "08:00", "14:30")
  days_of_week VARCHAR(13) NOT NULL DEFAULT '1111111', -- Mon-Sun: 1=active, 0=inactive
  is_active BOOLEAN DEFAULT true,
  notification_sent_today BOOLEAN DEFAULT false,
  last_notification_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, medicine_id, time_of_day)
);

-- Create reminder history for tracking
CREATE TABLE IF NOT EXISTS reminder_history (
  id SERIAL PRIMARY KEY,
  reminder_id INTEGER NOT NULL REFERENCES reminders(id) ON DELETE CASCADE,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  medicine_id INTEGER NOT NULL REFERENCES medicines(id) ON DELETE CASCADE,
  notification_date DATE NOT NULL,
  was_taken BOOLEAN DEFAULT false,
  taken_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_reminders_user_id ON reminders(user_id);
CREATE INDEX IF NOT EXISTS idx_reminders_medicine_id ON reminders(medicine_id);
CREATE INDEX IF NOT EXISTS idx_reminder_history_user_id ON reminder_history(user_id);
CREATE INDEX IF NOT EXISTS idx_reminder_history_date ON reminder_history(notification_date);
