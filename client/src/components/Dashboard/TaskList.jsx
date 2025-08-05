import { CheckCircle, Circle, Edit, Trash2, Calendar, Clock, AlertTriangle, Star } from 'lucide-react';
import { useState } from 'react';

const TaskList = ({ tasks, onToggleStatus, onEditTask, onDeleteTask }) => {
  const [hoveredTask, setHoveredTask] = useState(null);

  if (tasks.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="mx-auto h-32 w-32 bg-gradient-to-br from-blue-100 to-indigo-200 rounded-full flex items-center justify-center mb-8 shadow-2xl floating-element">
          <CheckCircle className="h-16 w-16 text-blue-500" />
        </div>
        <h3 className="text-2xl font-bold gradient-text mb-4">No tasks found</h3>
        <p className="text-gray-500 text-lg max-w-md mx-auto leading-relaxed">
          Ready to boost your productivity? Create your first task and start achieving your goals!
        </p>
        <div className="mt-8 flex justify-center space-x-4">
          <div className="flex items-center space-x-2 text-sm text-gray-400">
            <Star className="h-4 w-4" />
            <span>Organize</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-400">
            <CheckCircle className="h-4 w-4" />
            <span>Complete</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-400">
            <Calendar className="h-4 w-4" />
            <span>Achieve</span>
          </div>
        </div>
      </div>
    );
  }

  const formatDate = (dateString) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const isOverdue = (dueDate) => {
    if (!dueDate) return false;
    return new Date(dueDate) < new Date() && new Date(dueDate).toDateString() !== new Date().toDateString();
  };

  const getDaysUntilDue = (dueDate) => {
    if (!dueDate) return null;
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getPriorityColor = (dueDate, status) => {
    if (status === 'completed') return 'from-green-50 to-emerald-50 border-green-200';
    
    const daysUntil = getDaysUntilDue(dueDate);
    if (daysUntil === null) return 'from-blue-50 to-indigo-50 border-blue-200';
    if (daysUntil < 0) return 'from-red-50 to-pink-50 border-red-200';
    if (daysUntil <= 1) return 'from-orange-50 to-yellow-50 border-orange-200';
    if (daysUntil <= 3) return 'from-yellow-50 to-amber-50 border-yellow-200';
    return 'from-blue-50 to-indigo-50 border-blue-200';
  };

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {tasks.map((task, index) => {
        const daysUntil = getDaysUntilDue(task.due_date);
        const isTaskOverdue = isOverdue(task.due_date);
        
        return (
          <div
            key={task.id}
            className={`group task-card bg-gradient-to-br ${getPriorityColor(task.due_date, task.status)} animate-fade-in`}
            style={{ animationDelay: `${index * 0.1}s` }}
            onMouseEnter={() => setHoveredTask(task.id)}
            onMouseLeave={() => setHoveredTask(null)}
          >
            {/* Priority indicator */}
            <div className="absolute top-4 right-4 flex items-center space-x-2">
              {isTaskOverdue && task.status !== 'completed' && (
                <div className="flex items-center space-x-1 bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs font-semibold">
                  <AlertTriangle className="h-3 w-3" />
                  <span>Overdue</span>
                </div>
              )}
              <div className={`w-3 h-3 rounded-full ${
                task.status === 'completed' 
                  ? 'bg-green-400 shadow-lg shadow-green-200' 
                  : isTaskOverdue 
                    ? 'bg-red-400 shadow-lg shadow-red-200 animate-pulse' 
                    : 'bg-blue-400 shadow-lg shadow-blue-200'
              }`}></div>
            </div>
            
            <div className="flex items-start space-x-4">
              <button
                onClick={() => onToggleStatus(task)}
                className={`mt-1 flex-shrink-0 transition-all duration-300 transform hover:scale-125 ${
                  task.status === 'completed'
                    ? 'text-green-600 hover:text-green-700 drop-shadow-lg'
                    : 'text-gray-400 hover:text-blue-600'
                }`}
              >
                {task.status === 'completed' ? (
                  <CheckCircle className="h-7 w-7" />
                ) : (
                  <Circle className="h-7 w-7" />
                )}
              </button>

              <div className="flex-1 min-w-0">
                <h3 className={`text-lg font-bold mb-3 transition-all duration-200 ${
                  task.status === 'completed' 
                    ? 'text-gray-500 line-through' 
                    : 'text-gray-900'
                }`}>
                  {task.title}
                </h3>
                
                {task.description && (
                  <p className={`text-sm mb-4 leading-relaxed ${
                    task.status === 'completed' 
                      ? 'text-gray-400' 
                      : 'text-gray-600'
                  }`}>
                    {task.description}
                  </p>
                )}

                <div className="space-y-3">
                  <div className="flex items-center space-x-1 text-xs text-gray-500">
                    <Clock className="h-3 w-3" />
                    <span>Created {formatDate(task.created_at)}</span>
                  </div>
                  
                  {task.due_date && (
                    <div className={`flex items-center space-x-2 px-3 py-2 rounded-xl text-xs font-semibold ${
                      isTaskOverdue && task.status !== 'completed'
                        ? 'bg-red-100 text-red-800 border border-red-200' 
                        : task.status === 'completed'
                          ? 'bg-green-100 text-green-800 border border-green-200'
                          : daysUntil <= 1
                            ? 'bg-orange-100 text-orange-800 border border-orange-200'
                            : 'bg-blue-100 text-blue-800 border border-blue-200'
                    }`}>
                      <Calendar className="h-3 w-3" />
                      <span>Due {formatDate(task.due_date)}</span>
                      {daysUntil !== null && task.status !== 'completed' && (
                        <span className="ml-1">
                          {daysUntil < 0 
                            ? `(${Math.abs(daysUntil)} days overdue)` 
                            : daysUntil === 0 
                              ? '(Today)' 
                              : `(${daysUntil} days left)`
                          }
                        </span>
                      )}
                    </div>
                  )}
                </div>

                <div className="mt-4">
                  <span className={`inline-flex items-center px-4 py-2 rounded-xl text-xs font-bold shadow-sm ${
                    task.status === 'completed'
                      ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white'
                      : 'bg-gradient-to-r from-yellow-500 to-orange-600 text-white'
                  }`}>
                    {task.status === 'completed' ? '✓ Completed' : '⏳ In Progress'}
                  </span>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className={`absolute bottom-4 right-4 flex items-center space-x-2 transition-all duration-300 ${
              hoveredTask === task.id ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
            }`}>
              <button
                onClick={() => onEditTask(task)}
                className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200 transform hover:scale-110 shadow-lg"
                title="Edit task"
              >
                <Edit className="h-4 w-4" />
              </button>
              
              <button
                onClick={() => onDeleteTask(task.id)}
                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 transform hover:scale-110 shadow-lg"
                title="Delete task"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TaskList;