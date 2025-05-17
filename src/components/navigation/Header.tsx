import React from 'react';
import { useLocation } from 'react-router-dom';
import { Bell, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Header: React.FC = () => {
  const { user, signOut } = useAuth();
  const location = useLocation();

  // Get current page title from location
  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/') return 'Dashboard';
    return path.substring(1).charAt(0).toUpperCase() + path.substring(2).replace(/-/g, ' ');
  };

  return (
    <header className="bg-white shadow-sm z-10">
      <div className="px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold text-slate-800">{getPageTitle()}</h1>
          
          <div className="flex items-center space-x-4">
            <button 
              className="p-2 rounded-full hover:bg-slate-100 text-slate-500 transition-colors duration-200"
              aria-label="Notifications"
            >
              <Bell size={20} />
            </button>
            
            <div className="relative">
              <div className="flex items-center">
                {user?.avatar_url ? (
                  <img 
                    src={user.avatar_url} 
                    alt="User avatar"
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center">
                    <User size={16} className="text-slate-600" />
                  </div>
                )}
                <span className="ml-2 text-sm font-medium text-slate-700 hidden sm:block">
                  {user?.name || user?.email}
                </span>
              </div>

              <div className="absolute right-0 top-full mt-2 w-48 rounded-md shadow-lg hidden group-hover:block">
                <div className="py-1">
                  <button 
                    onClick={() => signOut()}
                    className="block w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
                  >
                    Sign out
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;