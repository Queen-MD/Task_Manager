import { All, Clock, CheckCircle2, TrendingUp } from 'lucide-react';

const FilterTabs = ({ activeFilter, onFilterChange, taskCounts }) => {
  const filters = [
    { 
      key: 'all', 
      label: 'All Tasks', 
      count: taskCounts.all,
      icon: All,
      color: 'from-gray-500 to-gray-600'
    },
    { 
      key: 'pending', 
      label: 'In Progress', 
      count: taskCounts.pending,
      icon: Clock,
      color: 'from-yellow-500 to-orange-600'
    },
    { 
      key: 'completed', 
      label: 'Completed', 
      count: taskCounts.completed,
      icon: CheckCircle2,
      color: 'from-green-500 to-emerald-600'
    }
  ];

  return (
    <div className="mb-8">
      <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-2 shadow-lg border border-gray-200/50">
        <nav className="flex space-x-2">
          {filters.map((filter) => {
            const IconComponent = filter.icon;
            const isActive = activeFilter === filter.key;
            
            return (
              <button
                key={filter.key}
                onClick={() => onFilterChange(filter.key)}
                className={`nav-tab flex-1 ${isActive ? 'active' : ''}`}
              >
                <div className="flex items-center justify-center space-x-3">
                  <div className={`p-2 rounded-lg ${isActive ? 'bg-white/20' : 'bg-gray-100'}`}>
                    <IconComponent className={`h-4 w-4 ${isActive ? 'text-white' : 'text-gray-600'}`} />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold">{filter.label}</div>
                    <div className={`text-xs ${isActive ? 'text-white/80' : 'text-gray-500'}`}>
                      {filter.count} tasks
                    </div>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                    isActive 
                      ? 'bg-white/20 text-white' 
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {filter.count}
                  </div>
                </div>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Quick Stats */}
      <div className="mt-4 grid grid-cols-3 gap-4">
        <div className="stats-card gradient-bg-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-white/80">Completion Rate</p>
              <p className="text-2xl font-bold text-white">
                {taskCounts.all > 0 ? Math.round((taskCounts.completed / taskCounts.all) * 100) : 0}%
              </p>
            </div>
            <TrendingUp className="h-8 w-8 text-white/60" />
          </div>
        </div>

        <div className="stats-card gradient-bg-2">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-white/80">Active Tasks</p>
              <p className="text-2xl font-bold text-white">{taskCounts.pending}</p>
            </div>
            <Clock className="h-8 w-8 text-white/60" />
          </div>
        </div>

        <div className="stats-card gradient-bg-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-white/80">Total Tasks</p>
              <p className="text-2xl font-bold text-white">{taskCounts.all}</p>
            </div>
            <All className="h-8 w-8 text-white/60" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterTabs;