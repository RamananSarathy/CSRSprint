/*
  # Initial schema setup for CSRSprint application

  1. New Tables
    - `events` - Stores information about CSR events
    - `tasks` - Stores tasks associated with events
    - `volunteers` - Stores volunteer information and skills
    - `impact_metrics` - Stores impact data for events
  
  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users

  3. Notes
    - Default timestamps are added to all tables
    - UUID primary keys are used for all tables
*/

-- Create events table
CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ NOT NULL,
  budget NUMERIC NOT NULL DEFAULT 0,
  location TEXT NOT NULL,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create tasks table
CREATE TABLE IF NOT EXISTS tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'to-do',
  due_date TIMESTAMPTZ NOT NULL,
  assigned_to UUID REFERENCES auth.users(id),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create volunteers table
CREATE TABLE IF NOT EXISTS volunteers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  skills TEXT[] NOT NULL DEFAULT '{}',
  location TEXT NOT NULL,
  availability TEXT[] NOT NULL DEFAULT '{}',
  events_participated UUID[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create impact_metrics table
CREATE TABLE IF NOT EXISTS impact_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  co2_saved NUMERIC NOT NULL DEFAULT 0,
  volunteer_hours NUMERIC NOT NULL DEFAULT 0,
  people_reached INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE volunteers ENABLE ROW LEVEL SECURITY;
ALTER TABLE impact_metrics ENABLE ROW LEVEL SECURITY;

-- Create policies for events
CREATE POLICY "Users can view all events" 
  ON events FOR SELECT 
  TO authenticated 
  USING (true);

CREATE POLICY "Users can insert their own events" 
  ON events FOR INSERT 
  TO authenticated 
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update their own events" 
  ON events FOR UPDATE 
  TO authenticated 
  USING (auth.uid() = created_by);

CREATE POLICY "Users can delete their own events" 
  ON events FOR DELETE 
  TO authenticated 
  USING (auth.uid() = created_by);

-- Create policies for tasks
CREATE POLICY "Users can view all tasks" 
  ON tasks FOR SELECT 
  TO authenticated 
  USING (true);

CREATE POLICY "Users can insert tasks" 
  ON tasks FOR INSERT 
  TO authenticated 
  WITH CHECK (true);

CREATE POLICY "Assigned users can update tasks" 
  ON tasks FOR UPDATE 
  TO authenticated 
  USING (auth.uid() = assigned_to OR EXISTS (
    SELECT 1 FROM events 
    WHERE events.id = tasks.event_id 
    AND events.created_by = auth.uid()
  ));

CREATE POLICY "Event creators can delete tasks" 
  ON tasks FOR DELETE 
  TO authenticated 
  USING (EXISTS (
    SELECT 1 FROM events 
    WHERE events.id = tasks.event_id 
    AND events.created_by = auth.uid()
  ));

-- Create policies for volunteers
CREATE POLICY "Users can view all volunteers" 
  ON volunteers FOR SELECT 
  TO authenticated 
  USING (true);

CREATE POLICY "Users can insert volunteers" 
  ON volunteers FOR INSERT 
  TO authenticated 
  WITH CHECK (true);

CREATE POLICY "Users can update volunteers" 
  ON volunteers FOR UPDATE 
  TO authenticated 
  USING (true);

-- Create policies for impact_metrics
CREATE POLICY "Users can view all impact metrics" 
  ON impact_metrics FOR SELECT 
  TO authenticated 
  USING (true);

CREATE POLICY "Event creators can insert impact metrics" 
  ON impact_metrics FOR INSERT 
  TO authenticated 
  WITH CHECK (EXISTS (
    SELECT 1 FROM events 
    WHERE events.id = impact_metrics.event_id 
    AND events.created_by = auth.uid()
  ));

CREATE POLICY "Event creators can update impact metrics" 
  ON impact_metrics FOR UPDATE 
  TO authenticated 
  USING (EXISTS (
    SELECT 1 FROM events 
    WHERE events.id = impact_metrics.event_id 
    AND events.created_by = auth.uid()
  ));