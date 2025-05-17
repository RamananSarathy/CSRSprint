import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../utils/supabaseClient';
import LoadingSpinner from '../components/common/LoadingSpinner';

interface Event {
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

function EventDetails() {
  const { id } = useParams();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchEventDetails() {
      try {
        const { data, error } = await supabase
          .from('events')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;
        setEvent(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    }

    fetchEventDetails();
  }, [id]);

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;
  if (!event) return <div className="p-4">Event not found</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">{event.title}</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-700 mb-2">Details</h2>
            <p className="text-gray-600 mb-4">{event.description}</p>
            
            <div className="space-y-2">
              <p className="text-gray-700">
                <span className="font-medium">Location:</span> {event.location}
              </p>
              <p className="text-gray-700">
                <span className="font-medium">Budget:</span> ${event.budget.toLocaleString()}
              </p>
            </div>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold text-gray-700 mb-2">Schedule</h2>
            <div className="space-y-2">
              <p className="text-gray-700">
                <span className="font-medium">Start Date:</span>{' '}
                {new Date(event.start_date).toLocaleDateString()}
              </p>
              <p className="text-gray-700">
                <span className="font-medium">End Date:</span>{' '}
                {new Date(event.end_date).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EventDetails;