import { Sun, Moon, Monitor, Palette } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useState } from 'react';

const ThemeToggle = ({ showLabel = false, variant = 'button' }) => {
  const { theme, toggleTheme, setTheme } = useTheme();
  const [showDropdown, setShowDropdown] = useState(false);

  const themes = [
    { key: 'light', label: 'Light', icon: Sun, color: 'text-amber-500' },
    { key: 'dark', label: 'Dark', icon: Moon, color: 'text-blue-400' },
    { key: 'system', label: 'System', icon: Monitor, color: 'text-gray-500' }
  ];

  const currentTheme = themes.find(t => t.key === theme);
  const CurrentIcon = currentTheme?.icon || Sun;

  if (variant === 'dropdown') {
    return (
      <div className="relative">
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-white/10 dark:bg-gray-800/50 backdrop-blur-xl border border-white/20 dark:border-gray-700/50 hover:bg-white/20 dark:hover:bg-gray-700/50 transition-all duration-300 hover:scale-105"
        >
          <CurrentIcon className={`h-4 w-4 ${currentTheme?.color}`} />
          {showLabel && <span className="text-sm font-medium">{currentTheme?.label}</span>}
        </button>

        {showDropdown && (
          <div className="absolute right-0 mt-2 w-48 bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 py-2 z-50 animate-slide-up">
            <div className="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider border-b border-gray-200/50 dark:border-gray-700/50">
              Theme
            </div>
            {themes.map((themeOption) => {
              const Icon = themeOption.icon;
              const isActive = theme === themeOption.key;
              
              return (
                <button
                  key={themeOption.key}
                  onClick={() => {
                    setTheme(themeOption.key);
                    setShowDropdown(false);
                  }}
                  className={`w-full flex items-center space-x-3 px-4 py-3 text-sm hover:bg-gray-100/50 dark:hover:bg-gray-700/50 transition-all duration-200 ${
                    isActive ? 'bg-blue-50/50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'
                  }`}
                >
                  <Icon className={`h-4 w-4 ${isActive ? 'text-blue-500' : themeOption.color}`} />
                  <span className="font-medium">{themeOption.label}</span>
                  {isActive && (
                    <div className="ml-auto w-2 h-2 bg-blue-500 rounded-full"></div>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className="flex items-center space-x-2 p-3 rounded-xl bg-white/10 dark:bg-gray-800/50 backdrop-blur-xl border border-white/20 dark:border-gray-700/50 hover:bg-white/20 dark:hover:bg-gray-700/50 transition-all duration-300 hover:scale-105 group"
      title={`Switch to ${themes[(themes.findIndex(t => t.key === theme) + 1) % themes.length].label.toLowerCase()} theme`}
    >
      <CurrentIcon className={`h-5 w-5 ${currentTheme?.color} group-hover:scale-110 transition-transform duration-200`} />
      {showLabel && (
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {currentTheme?.label}
        </span>
      )}
    </button>
  );
};

export default ThemeToggle;