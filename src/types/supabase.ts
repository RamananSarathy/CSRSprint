export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      events: {
        Row: {
          id: string
          title: string
          description: string
          start_date: string
          end_date: string
          budget: number
          location: string
          created_by: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          start_date: string
          end_date: string
          budget: number
          location: string
          created_by: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          start_date?: string
          end_date?: string
          budget?: number
          location?: string
          created_by?: string
          created_at?: string
          updated_at?: string
        }
      }
      tasks: {
        Row: {
          id: string
          title: string
          description: string
          status: string
          due_date: string
          assigned_to: string
          event_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          status: string
          due_date: string
          assigned_to: string
          event_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          status?: string
          due_date?: string
          assigned_to?: string
          event_id?: string
          created_at?: string
          updated_at?: string
        }
      }
      volunteers: {
        Row: {
          id: string
          name: string
          email: string
          skills: string[]
          location: string
          availability: string[]
          events_participated: string[]
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          skills: string[]
          location: string
          availability: string[]
          events_participated?: string[]
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          skills?: string[]
          location?: string
          availability?: string[]
          events_participated?: string[]
          created_at?: string
        }
      }
      impact_metrics: {
        Row: {
          id: string
          event_id: string
          co2_saved: number
          volunteer_hours: number
          people_reached: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          event_id: string
          co2_saved: number
          volunteer_hours: number
          people_reached: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          event_id?: string
          co2_saved?: number
          volunteer_hours?: number
          people_reached?: number
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}