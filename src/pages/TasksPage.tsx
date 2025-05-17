import React, { useEffect, useState } from 'react';
import { supabase } from '../utils/supabaseClient';
import LoadingSpinner from '../components/common/LoadingSpinner';

interface Task {
  id: string;
  title: string;
  description: string;
  status: string;
  due_date: string;
  assigned_to: string | null;
  event_id: string | null;
  created_at: string;
  updated_at: string;
}

function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTasks();
  }, []);

  async function fetchTasks() {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTasks(data || []);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Tasks</h1>
      <div className="grid gap-6">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <h3 className="text-xl font-semibold mb-2">{task.title}</h3>
            <p className="text-gray-600 mb-4">{task.description}</p>
            <div className="flex justify-between items-center">
              <span className={`px-3 py-1 rounded-full text-sm ${
                task.status === 'completed' 
                  ? 'bg-green-100 text-green-800'
                  : task.status === 'in-progress'
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {task.status}
              </span>
              <span className="text-sm text-gray-500">
                Due: {new Date(task.due_date).toLocaleDateString()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TasksPage;