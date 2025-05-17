import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Calendar, List, Users, BarChart3 } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '../utils/supabaseClient';
import { Event, Task, ImpactMetric, Widget } from '../types';
import LoadingSpinner from '../components/common/LoadingSpinner';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  change?: string;
  positive?: boolean;
  link: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, change, positive, link }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-lg shadow-sm p-6 flex flex-col"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="p-2 rounded-md bg-slate-100">{icon}</div>
        <Link to={link} className="text-sm text-slate-500 hover:text-slate-700 flex items-center">
          View all
          <ArrowUpRight size={14} className="ml-1" />
        </Link>
      </div>
      <div className="mt-2">
        <h3 className="text-sm font-medium text-slate-500">{title}</h3>
        <p className="text-2xl font-semibold text-slate-800 mt-1">{value}</p>
      </div>
      {change && (
        <div className={`mt-2 text-sm ${positive ? 'text-emerald-500' : 'text-red-500'}`}>
          {positive ? '↑' : '↓'} {change} from last month
        </div>
      )}
    </motion.div>
  );
};

const Dashboard: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [impact, setImpact] = useState<ImpactMetric[]>([]);
  const [volunteers, setVolunteers] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [widgets, setWidgets] = useState<Widget[]>([
    { id: '1', type: 'events', position: 1, size: 'md', title: 'Upcoming Events' },
    { id: '2', type: 'tasks', position: 2, size: 'md', title: 'Recent Tasks' },
    { id: '3', type: 'impact', position: 3, size: 'md', title: 'Impact Summary' },
    { id: '4', type: 'volunteers', position: 4, size: 'sm', title: 'Volunteer Stats' },
    { id: '5', type: 'ai-assistant', position: 5, size: 'sm', title: 'AI Suggestions' },
  ]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      
      // Fetch upcoming events
      const { data: eventsData } = await supabase
        .from('events')
        .select('*')
        .order('start_date', { ascending: true })
        .limit(5);
      
      if (eventsData) setEvents(eventsData);
      
      // Fetch recent tasks
      const { data: tasksData } = await supabase
        .from('tasks')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);
      
      if (tasksData) setTasks(tasksData);
      
      // Fetch impact metrics
      const { data: impactData } = await supabase
        .from('impact_metrics')
        .select('*');
      
      if (impactData) setImpact(impactData);
      
      // Count volunteers
      const { count } = await supabase
        .from('volunteers')
        .select('*', { count: 'exact', head: true });
      
      if (count !== null) setVolunteers(count);
      
      setLoading(false);
    };
    
    fetchDashboardData();
  }, []);

  const totalVolunteerHours = impact.reduce((sum, metric) => sum + metric.volunteer_hours, 0);
  const totalCO2Saved = impact.reduce((sum, metric) => sum + metric.co2_saved, 0);
  const totalPeopleReached = impact.reduce((sum, metric) => sum + metric.people_reached, 0);

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Upcoming Events" 
          value={events.length} 
          icon={<Calendar size={20} className="text-emerald-600" />} 
          change="12%"
          positive={true}
          link="/events"
        />
        <StatCard 
          title="Open Tasks" 
          value={tasks.filter(t => t.status !== 'done').length} 
          icon={<List size={20} className="text-blue-600" />} 
          change="5%"
          positive={true}
          link="/tasks"
        />
        <StatCard 
          title="Volunteer Hours" 
          value={totalVolunteerHours} 
          icon={<Users size={20} className="text-violet-600" />} 
          change="8%"
          positive={true}
          link="/volunteers"
        />
        <StatCard 
          title="CO₂ Saved (kg)" 
          value={totalCO2Saved.toLocaleString()} 
          icon={<BarChart3 size={20} className="text-emerald-600" />} 
          change="14%"
          positive={true}
          link="/impact"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upcoming Events Widget */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-slate-800">Upcoming Events</h2>
            <Link 
              to="/events" 
              className="text-sm text-emerald-600 hover:text-emerald-700"
            >
              View all
            </Link>
          </div>
          
          {events.length > 0 ? (
            <div className="space-y-4">
              {events.slice(0, 3).map((event) => (
                <Link 
                  key={event.id} 
                  to={`/events/${event.id}`}
                  className="block p-4 border border-slate-200 rounded-md hover:bg-slate-50 transition-colors"
                >
                  <div className="flex justify-between">
                    <h3 className="font-medium text-slate-800">{event.title}</h3>
                    <span className="text-sm text-slate-500">
                      {new Date(event.start_date).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-slate-600 line-clamp-2">{event.description}</p>
                  <div className="mt-2 text-xs text-slate-500">{event.location}</div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center text-slate-500">No upcoming events</div>
          )}
        </div>

        {/* Recent Tasks Widget */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-slate-800">Recent Tasks</h2>
            <Link 
              to="/tasks" 
              className="text-sm text-emerald-600 hover:text-emerald-700"
            >
              View all
            </Link>
          </div>
          
          {tasks.length > 0 ? (
            <div className="space-y-2">
              {tasks.slice(0, 5).map((task) => (
                <div key={task.id} className="p-3 border-b border-slate-100 last:border-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div
                        className={`w-2 h-2 rounded-full mr-2 ${
                          task.status === 'to-do'
                            ? 'bg-blue-500'
                            : task.status === 'in-progress'
                            ? 'bg-amber-500'
                            : task.status === 'review'
                            ? 'bg-purple-500'
                            : 'bg-emerald-500'
                        }`}
                      />
                      <span className="font-medium text-sm text-slate-800">{task.title}</span>
                    </div>
                    <span className="text-xs text-slate-500">
                      {new Date(task.due_date).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-slate-600 pl-4">{task.status}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center text-slate-500">No tasks available</div>
          )}
        </div>
      </div>

      {/* Impact Metrics */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-medium text-slate-800 mb-4">Impact Overview</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-emerald-50 rounded-lg">
            <span className="text-3xl font-bold text-emerald-600">{totalCO2Saved.toLocaleString()}</span>
            <p className="mt-1 text-sm text-slate-600">kg CO₂ Saved</p>
          </div>
          
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <span className="text-3xl font-bold text-blue-600">{totalVolunteerHours.toLocaleString()}</span>
            <p className="mt-1 text-sm text-slate-600">Volunteer Hours</p>
          </div>
          
          <div className="text-center p-4 bg-violet-50 rounded-lg">
            <span className="text-3xl font-bold text-violet-600">{totalPeopleReached.toLocaleString()}</span>
            <p className="mt-1 text-sm text-slate-600">People Reached</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;