import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Calendar, 
  MapPin, 
  Clock, 
  DollarSign, 
  Plus,
  Search,
  Filter,
  ArrowUpDown
} from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '../utils/supabaseClient';
import { Event } from '../types';
import LoadingSpinner from '../components/common/LoadingSpinner';

const EventsPage: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'title'>('date');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    start_date: '',
    end_date: '',
    budget: 0,
    location: '',
  });

  useEffect(() => {
    fetchEvents();
  }, [sortBy]);

  const fetchEvents = async () => {
    setLoading(true);
    
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order(sortBy === 'date' ? 'start_date' : 'title', { ascending: true });
    
    if (error) {
      console.error('Error fetching events:', error);
    } else if (data) {
      setEvents(data);
    }
    
    setLoading(false);
  };

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Get user ID from auth context for created_by field
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return;
    
    const { error } = await supabase.from('events').insert({
      ...newEvent,
      created_by: user.id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
    
    if (error) {
      console.error('Error creating event:', error);
    } else {
      // Reset form and close modal
      setNewEvent({
        title: '',
        description: '',
        start_date: '',
        end_date: '',
        budget: 0,
        location: '',
      });
      setShowCreateModal(false);
      fetchEvents();
    }
  };

  const filteredEvents = events.filter((event) =>
    event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-slate-800">Events</h1>
        
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-md flex items-center text-sm font-medium transition-colors"
        >
          <Plus size={16} className="mr-1" />
          Create Event
        </button>
      </div>

      <div className="mb-6 p-4 bg-white rounded-lg shadow-sm">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-slate-400" />
            </div>
            <input
              type="text"
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-md text-sm placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setSortBy('date')}
              className={`px-3 py-2 text-sm font-medium rounded-md flex items-center ${
                sortBy === 'date'
                  ? 'bg-slate-100 text-slate-800'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Calendar size={16} className="mr-1" />
              Date
            </button>
            <button
              onClick={() => setSortBy('title')}
              className={`px-3 py-2 text-sm font-medium rounded-md flex items-center ${
                sortBy === 'title'
                  ? 'bg-slate-100 text-slate-800'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <ArrowUpDown size={16} className="mr-1" />
              Title
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="py-20 flex justify-center">
          <LoadingSpinner size="lg" />
        </div>
      ) : filteredEvents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-lg shadow-sm overflow-hidden flex flex-col"
            >
              <div className="p-5">
                <h3 className="text-lg font-semibold text-slate-800 mb-2">
                  {event.title}
                </h3>
                <p className="text-slate-600 text-sm mb-4 line-clamp-2">
                  {event.description}
                </p>
                
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-slate-500">
                    <Calendar size={16} className="mr-2" />
                    <span>
                      {new Date(event.start_date).toLocaleDateString()} - {new Date(event.end_date).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <div className="flex items-center text-sm text-slate-500">
                    <MapPin size={16} className="mr-2" />
                    <span>{event.location}</span>
                  </div>
                  
                  <div className="flex items-center text-sm text-slate-500">
                    <DollarSign size={16} className="mr-2" />
                    <span>Budget: ${event.budget.toLocaleString()}</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-auto p-3 bg-slate-50 border-t border-slate-100">
                <Link
                  to={`/events/${event.id}`}
                  className="block w-full px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-center rounded-md text-sm font-medium transition-colors"
                >
                  View Details
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="py-20 text-center">
          <div className="inline-flex justify-center items-center w-16 h-16 rounded-full bg-slate-100 mb-4">
            <Calendar size={24} className="text-slate-400" />
          </div>
          <h3 className="text-lg font-medium text-slate-800">No events found</h3>
          <p className="mt-1 text-slate-500">
            {searchTerm ? 'Try adjusting your search terms' : 'Create your first event to get started'}
          </p>
        </div>
      )}

      {/* Create Event Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
            <div className="p-6 border-b border-slate-200">
              <h2 className="text-xl font-semibold text-slate-800">Create New Event</h2>
            </div>
            
            <form onSubmit={handleCreateEvent}>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="title">
                    Event Title
                  </label>
                  <input
                    id="title"
                    type="text"
                    required
                    value={newEvent.title}
                    onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                    className="block w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="description">
                    Description
                  </label>
                  <textarea
                    id="description"
                    required
                    value={newEvent.description}
                    onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                    rows={3}
                    className="block w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="start-date">
                      Start Date
                    </label>
                    <input
                      id="start-date"
                      type="date"
                      required
                      value={newEvent.start_date}
                      onChange={(e) => setNewEvent({ ...newEvent, start_date: e.target.value })}
                      className="block w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="end-date">
                      End Date
                    </label>
                    <input
                      id="end-date"
                      type="date"
                      required
                      value={newEvent.end_date}
                      onChange={(e) => setNewEvent({ ...newEvent, end_date: e.target.value })}
                      className="block w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="budget">
                      Budget
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <DollarSign size={16} className="text-slate-400" />
                      </div>
                      <input
                        id="budget"
                        type="number"
                        required
                        min="0"
                        value={newEvent.budget}
                        onChange={(e) => setNewEvent({ ...newEvent, budget: parseFloat(e.target.value) })}
                        className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="location">
                      Location
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <MapPin size={16} className="text-slate-400" />
                      </div>
                      <input
                        id="location"
                        type="text"
                        required
                        value={newEvent.location}
                        onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                        className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-6 border-t border-slate-200 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 border border-slate-300 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 text-white rounded-md text-sm font-medium hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                >
                  Create Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventsPage;