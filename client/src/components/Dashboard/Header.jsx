import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Plus, LogOut, Settings, User, Bell, Search, Menu, X } from 'lucide-react';
import ThemeToggle from '../ui/ThemeToggle';

const Header = ({ onAddTask }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="header">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-500 dark:via-indigo-500 dark:to-purple-500 rounded-xl flex items-center justify-center shadow-lg hover-glow">
                <span className="text-white font-bold text-lg">TM</span>
              </div>
              <div>
                <h1 className="text-xl font-bold gradient-text">Task Manager</h1>
                <p className="text-xs text-gray-500 dark:text-gray-400 hidden sm:block">Productivity at its finest</p>
              </div>
            </div>
          </div>

          {/* Search Bar - Hidden on mobile */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400 dark:text-gray-500" />
              </div>
              <input
                type="text"
                className="input-field pl-10 py-2 text-sm"
                placeholder="Search tasks..."
              />
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <ThemeToggle />
            
            <button
              onClick={onAddTask}
              className="btn-primary flex items-center space-x-2 hover-lift"
            >
              <Plus className="h-4 w-4" />
              <span>New Task</span>
            </button>

            {/* Notifications */}
            <button className="relative p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all duration-200">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 dark:bg-red-400 rounded-full animate-pulse"></span>
            </button>

            {user?.is_admin && (
              <button
                onClick={() => navigate('/admin')}
                className="btn-secondary flex items-center space-x-2 hover-lift"
              >
                <Settings className="h-4 w-4" />
                <span>Admin</span>
              </button>
            )}

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-3 p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
              >
                <div className="h-8 w-8 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-500 dark:to-indigo-500 rounded-full flex items-center justify-center ring-2 ring-blue-100 dark:ring-blue-900">
                  <User className="h-4 w-4 text-white" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">{user?.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{user?.is_admin ? 'Administrator' : 'User'}</p>
                </div>
              </button>

              {/* User Dropdown */}
              {showUserMenu && (
                <div className="dropdown-menu absolute right-0 mt-2 w-56">
                  <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                    <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{user?.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{user?.email}</p>
                  </div>
                  
                  <div className="py-2">
                    <button className="dropdown-item">
                      <User className="h-4 w-4" />
                      <span>Profile Settings</span>
                    </button>
                    <button className="dropdown-item">
                      <Settings className="h-4 w-4" />
                      <span>Preferences</span>
                    </button>
                  </div>
                  
                  <div className="border-t border-gray-100 dark:border-gray-700 pt-2">
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center space-x-2 transition-colors duration-200"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all duration-200"
            >
              {showMobileMenu ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {showMobileMenu && (
          <div className="md:hidden border-t border-gray-200/50 dark:border-gray-700/50 py-4 animate-slide-up">
            <div className="space-y-3">
              {/* Search on mobile */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                </div>
                <input
                  type="text"
                  className="input-field pl-10 py-2 text-sm w-full"
                  placeholder="Search tasks..."
                />
              </div>

              <div className="flex justify-center">
                <ThemeToggle showLabel variant="dropdown" />
              </div>

              <button
                onClick={onAddTask}
                className="w-full btn-primary flex items-center justify-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>New Task</span>
              </button>

              {user?.is_admin && (
                <button
                  onClick={() => navigate('/admin')}
                  className="w-full btn-secondary flex items-center justify-center space-x-2"
                >
                  <Settings className="h-4 w-4" />
                  <span>Admin Panel</span>
                </button>
              )}

              <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
                <div className="flex items-center space-x-3 px-2 py-2">
                  <div className="h-10 w-10 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-500 dark:to-indigo-500 rounded-full flex items-center justify-center">
                    <User className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{user?.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{user?.email}</p>
                  </div>
                </div>
                
                <button
                  onClick={handleLogout}
                  className="w-full mt-2 text-left px-2 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg flex items-center space-x-2 transition-colors duration-200"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;