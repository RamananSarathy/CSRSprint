import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Dashboard from './pages/Dashboard';
import EventsPage from './pages/EventsPage';
import EventDetails from './pages/EventDetails';
import TasksPage from './pages/TasksPage';
import VolunteersPage from './pages/VolunteersPage';
import ImpactPage from './pages/ImpactPage';
import AIAssistant from './pages/AIAssistant';
import Login from './pages/Login';

import Layout from './components/Layout';
import PrivateRoute from './components/PrivateRoute';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <Router>
      <AuthProvider>
        <ToastContainer position="top-right" autoClose={3000} />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route element={<PrivateRoute />}>
            <Route element={<Layout />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/events" element={<EventsPage />} />
              <Route path="/events/:id" element={<EventDetails />} />
              <Route path="/tasks" element={<TasksPage />} />
              <Route path="/volunteers" element={<VolunteersPage />} />
              <Route path="/impact" element={<ImpactPage />} />
              <Route path="/ai-assistant" element={<AIAssistant />} />
            </Route>
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;