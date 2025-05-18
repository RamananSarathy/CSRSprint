/*
  # Add user roles and task reminders

  1. New Tables
    - `user_roles` - Stores user role assignments
    - `task_reminders` - Stores task reminder settings
  
  2. Changes
    - Add role field to volunteers table
    - Add reminder settings to tasks table
  
  3. Security
    - Enable RLS on new tables
    - Add policies for role management
*/

-- Create user_roles table
CREATE TABLE IF NOT EXISTS user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('admin', 'coordinator', 'volunteer')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, role)
);

-- Create task_reminders table
CREATE TABLE IF NOT EXISTS task_reminders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
  reminder_time TIMESTAMPTZ NOT NULL,
  enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Add role field to volunteers
ALTER TABLE volunteers
ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'volunteer'
CHECK (role IN ('admin', 'coordinator', 'volunteer'));

-- Add reminder settings to tasks
ALTER TABLE tasks
ADD COLUMN IF NOT EXISTS has_reminder BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS reminder_timezone TEXT DEFAULT 'UTC';

-- Enable RLS
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_reminders ENABLE ROW LEVEL SECURITY;

-- Policies for user_roles
CREATE POLICY "Admins can manage roles"
  ON user_roles
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles ur
      WHERE ur.user_id = auth.uid()
      AND ur.role = 'admin'
    )
  );

CREATE POLICY "Users can view roles"
  ON user_roles
  FOR SELECT
  TO authenticated
  USING (true);

-- Policies for task_reminders
CREATE POLICY "Users can manage their task reminders"
  ON task_reminders
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM tasks t
      WHERE t.id = task_reminders.task_id
      AND (t.assigned_to = auth.uid() OR t.created_by = auth.uid())
    )
  );

CREATE POLICY "Users can view task reminders"
  ON task_reminders
  FOR SELECT
  TO authenticated
  USING (true);