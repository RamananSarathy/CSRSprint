/*
  # Add task reminders table and relationships
  
  1. New Tables
    - `task_reminders`
      - `id` (uuid, primary key)
      - `task_id` (uuid, foreign key to tasks)
      - `reminder_time` (timestamptz)
      - `enabled` (boolean)
      - `created_at` (timestamptz)
  
  2. Security
    - Enable RLS on task_reminders table
    - Add policies for authenticated users
*/

CREATE TABLE IF NOT EXISTS task_reminders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id uuid REFERENCES tasks(id) ON DELETE CASCADE,
  reminder_time timestamptz NOT NULL,
  enabled boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE task_reminders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own task reminders"
  ON task_reminders
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM tasks
      WHERE tasks.id = task_reminders.task_id
      AND tasks.assigned_to = auth.uid()
    )
  );