import { CheckCircle, Circle, Edit, Trash2, Calendar, Clock } from 'lucide-react';

const TaskList = ({ tasks, onToggleStatus, onEditTask, onDeleteTask }) => {
  if (tasks.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="mx-auto h-32 w-32 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-full flex items-center justify-center mb-6 shadow-inner">
          <CheckCircle className="h-16 w-16 text-blue-400" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-3">No tasks found</h3>
        <p className="text-gray-500 text-lg">Create your first task to get started on your productivity journey!</p>
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

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {tasks.map((task) => (
        <div
          key={task.id}
          className={`group relative bg-white rounded-xl shadow-sm border border-gray-200/50 p-6 transition-all duration-300 hover:shadow-xl hover:scale-[1.02] hover:-translate-y-1 ${
            task.status === 'completed' ? 'opacity-75 bg-gradient-to-br from-green-50 to-emerald-50' : 'hover:bg-gradient-to-br hover:from-blue-50 hover:to-indigo-50'
          }`}
        >
          {/* Status indicator */}
          <div className={`absolute top-4 right-4 w-3 h-3 rounded-full ${
            task.status === 'completed' ? 'bg-green-400' : 'bg-yellow-400'
          }`}></div>
          
          <div className="flex items-start space-x-4">
            <button
              onClick={() => onToggleStatus(task)}
              className={`mt-1 flex-shrink-0 transition-all duration-200 transform hover:scale-110 ${
                task.status === 'completed'
                  ? 'text-green-600 hover:text-green-700 drop-shadow-sm'
                  : 'text-gray-400 hover:text-blue-600'
              }`}
            >
              {task.status === 'completed' ? (
                <CheckCircle className="h-6 w-6" />
              ) : (
                <Circle className="h-6 w-6" />
              )}
            </button>

            <div className="flex-1 min-w-0">
              <h3 className={`text-lg font-semibold mb-2 ${
                task.status === 'completed' 
                  ? 'text-gray-500 line-through' 
                  : 'text-gray-900'
              }`}>
                {task.title}
              </h3>
              
              {task.description && (
                <p className={`mt-1 text-sm ${
                  task.status === 'completed' 
                    ? 'text-gray-400' 
                    : 'text-gray-600'
                }`}>
                  {task.description}
                </p>
              )}

              <div className="mt-4 flex flex-col space-y-2 text-xs text-gray-500">
                <div className="flex items-center space-x-1">
                  <Clock className="h-3 w-3" />
                  <span>Created {formatDate(task.created_at)}</span>
                </div>
                
                {task.due_date && (
                  <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${
                    isOverdue(task.due_date) && task.status !== 'completed'
                      ? 'bg-red-100 text-red-700' 
                      : 'bg-blue-100 text-blue-700'
                  }`}>
                    <Calendar className="h-3 w-3" />
                    <span>Due {formatDate(task.due_date)}</span>
                    {isOverdue(task.due_date) && task.status !== 'completed' && (
                      <span className="font-semibold">(Overdue)</span>
                    )}
                  </div>
                )}
              </div>

              <div className="mt-4">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold shadow-sm ${
                  task.status === 'completed'
                    ? 'bg-green-100 text-green-800 ring-1 ring-green-200'
                    : 'bg-yellow-100 text-yellow-800 ring-1 ring-yellow-200'
                }`}>
                  {task.status === 'completed' ? 'Completed' : 'Pending'}
                </span>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="absolute bottom-4 right-4 flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <button
                onClick={() => onEditTask(task)}
                className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 transform hover:scale-110"
                title="Edit task"
              >
                <Edit className="h-4 w-4" />
              </button>
              
              <button
                onClick={() => onDeleteTask(task.id)}
                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 transform hover:scale-110"
                title="Delete task"
              >
                <Trash2 className="h-4 w-4" />
              </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TaskList;