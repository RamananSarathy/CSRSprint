import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Calendar, 
  List, 
  Users, 
  BarChart3, 
  Bot,
  LogOut
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Sidebar: React.FC = () => {
  const location = useLocation();
  const { signOut } = useAuth();
  
  const navItems = [
    { to: '/', icon: <LayoutDashboard size={20} />, text: 'Dashboard' },
    { to: '/events', icon: <Calendar size={20} />, text: 'Events' },
    { to: '/tasks', icon: <List size={20} />, text: 'Tasks' },
    { to: '/volunteers', icon: <Users size={20} />, text: 'Volunteers' },
    { to: '/impact', icon: <BarChart3 size={20} />, text: 'Impact' },
    { to: '/ai-assistant', icon: <Bot size={20} />, text: 'AI Assistant' },
  ];

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-6">
        <Link to="/" className="flex items-center">
          <div className="flex items-center justify-center w-10 h-10 rounded-md bg-emerald-500 text-white">
            <Calendar size={24} />
          </div>
          <span className="ml-2 text-xl font-semibold text-white">CSRSprint</span>
        </Link>
      </div>
      
      <nav className="flex-1 px-2 mt-6">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.to}>
              <Link
                to={item.to}
                className={`flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors duration-200 ${
                  location.pathname === item.to
                    ? 'bg-slate-700 text-white'
                    : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                }`}
              >
                {item.icon}
                <span className="ml-3">{item.text}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="px-2 pb-6">
        <button
          onClick={() => signOut()}
          className="flex items-center w-full px-4 py-3 text-sm font-medium text-slate-300 rounded-md hover:bg-slate-700 hover:text-white transition-colors duration-200"
        >
          <LogOut size={20} />
          <span className="ml-3">Sign out</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;