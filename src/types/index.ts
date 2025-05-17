export interface User {
  id: string;
  email: string;
  name?: string;
  avatar_url?: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  budget: number;
  location: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'to-do' | 'in-progress' | 'review' | 'done';
  due_date: string;
  assigned_to: string;
  event_id: string;
  created_at: string;
  updated_at: string;
}

export interface Volunteer {
  id: string;
  name: string;
  email: string;
  skills: string[];
  location: string;
  availability: string[];
  events_participated: string[];
  created_at: string;
}

export interface ImpactMetric {
  id: string;
  event_id: string;
  co2_saved: number;
  volunteer_hours: number;
  people_reached: number;
  created_at: string;
  updated_at: string;
}

export type KanbanColumn = {
  id: string;
  title: string;
  tasks: Task[];
};

export type Widget = {
  id: string;
  type: 'events' | 'tasks' | 'impact' | 'volunteers' | 'ai-assistant';
  position: number;
  size: 'sm' | 'md' | 'lg';
  title: string;
};

export type AIAssistantResponse = {
  text: string;
  type: 'idea' | 'summary' | 'follow-up';
};