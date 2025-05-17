import React, { useEffect, useState } from 'react';
import { supabase } from '../utils/supabaseClient';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { Users } from 'lucide-react';

interface Volunteer {
  id: string;
  name: string;
  email: string;
  skills: string[];
  location: string;
  availability: string[];
  events_participated: string[];
  created_at: string;
}

function VolunteersPage() {
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVolunteers();
  }, []);

  async function fetchVolunteers() {
    try {
      const { data, error } = await supabase
        .from('volunteers')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setVolunteers(data || []);
    } catch (error) {
      console.error('Error fetching volunteers:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Users className="h-6 w-6 text-green-600" />
          <h1 className="text-2xl font-bold text-gray-900">Volunteers</h1>
        </div>
        <button
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          onClick={() => {/* Add volunteer modal logic */}}
        >
          Add Volunteer
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {volunteers.map((volunteer) => (
          <div
            key={volunteer.id}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {volunteer.name}
            </h3>
            <p className="text-gray-600 mb-4">{volunteer.email}</p>
            
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Skills</h4>
              <div className="flex flex-wrap gap-2">
                {volunteer.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-green-100 text-green-800 text-sm rounded-full"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Location</h4>
              <p className="text-gray-600">{volunteer.location}</p>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Availability</h4>
              <div className="flex flex-wrap gap-2">
                {volunteer.availability.map((time, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                  >
                    {time}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default VolunteersPage;