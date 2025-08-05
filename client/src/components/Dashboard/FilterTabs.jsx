const FilterTabs = ({ activeFilter, onFilterChange, taskCounts }) => {
  const filters = [
    { key: 'all', label: 'All Tasks', count: taskCounts.all },
    { key: 'pending', label: 'Pending', count: taskCounts.pending },
    { key: 'completed', label: 'Completed', count: taskCounts.completed }
  ];

  return (
    <div className="mb-8">
      <div className="bg-white/60 backdrop-blur-sm rounded-xl p-1 shadow-sm border border-gray-200/50">
        <nav className="flex space-x-1">
          {filters.map((filter) => (
            <button
              key={filter.key}
              onClick={() => onFilterChange(filter.key)}
              className={`flex-1 py-3 px-4 rounded-lg font-medium text-sm transition-all duration-200 ${
                activeFilter === filter.key
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md transform scale-105'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-white/80'
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <span>{filter.label}</span>
                <span className={`py-0.5 px-2 rounded-full text-xs font-semibold ${
                  activeFilter === filter.key
                    ? 'bg-white/20 text-white'
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  {filter.count}
                </span>
              </div>
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default FilterTabs;