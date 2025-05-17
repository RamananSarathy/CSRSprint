import React, { useEffect, useState } from 'react';
import { supabase } from '../utils/supabaseClient';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { BarChart3, Users, Leaf } from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface ImpactMetric {
  id: string;
  event_id: string;
  co2_saved: number;
  volunteer_hours: number;
  people_reached: number;
  created_at: string;
  updated_at: string;
}

interface Event {
  id: string;
  title: string;
}

function ImpactPage() {
  const [metrics, setMetrics] = useState<ImpactMetric[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const [metricsResponse, eventsResponse] = await Promise.all([
        supabase.from('impact_metrics').select('*'),
        supabase.from('events').select('id, title')
      ]);

      if (metricsResponse.error) throw metricsResponse.error;
      if (eventsResponse.error) throw eventsResponse.error;

      setMetrics(metricsResponse.data || []);
      setEvents(eventsResponse.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  }

  const totalCO2Saved = metrics.reduce((sum, metric) => sum + metric.co2_saved, 0);
  const totalVolunteerHours = metrics.reduce((sum, metric) => sum + metric.volunteer_hours, 0);
  const totalPeopleReached = metrics.reduce((sum, metric) => sum + metric.people_reached, 0);

  const chartData = {
    labels: events.map(event => event.title),
    datasets: [
      {
        label: 'CO₂ Saved (kg)',
        data: metrics.map(metric => metric.co2_saved),
        backgroundColor: 'rgba(16, 185, 129, 0.5)',
        borderColor: 'rgb(16, 185, 129)',
        borderWidth: 1
      },
      {
        label: 'Volunteer Hours',
        data: metrics.map(metric => metric.volunteer_hours),
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 1
      },
      {
        label: 'People Reached',
        data: metrics.map(metric => metric.people_reached),
        backgroundColor: 'rgba(139, 92, 246, 0.5)',
        borderColor: 'rgb(139, 92, 246)',
        borderWidth: 1
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Impact Metrics by Event'
      }
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Impact Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-2 mb-4">
            <Leaf className="h-6 w-6 text-green-600" />
            <h2 className="text-lg font-semibold text-gray-900">CO₂ Saved</h2>
          </div>
          <p className="text-3xl font-bold text-green-600">{totalCO2Saved.toLocaleString()} kg</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-2 mb-4">
            <Users className="h-6 w-6 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-900">Volunteer Hours</h2>
          </div>
          <p className="text-3xl font-bold text-blue-600">{totalVolunteerHours.toLocaleString()}</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="h-6 w-6 text-purple-600" />
            <h2 className="text-lg font-semibold text-gray-900">People Reached</h2>
          </div>
          <p className="text-3xl font-bold text-purple-600">{totalPeopleReached.toLocaleString()}</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <Bar data={chartData} options={chartOptions} />
      </div>
    </div>
  );
}

export default ImpactPage;