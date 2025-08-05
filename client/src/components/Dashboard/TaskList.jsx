import { CheckCircle, Circle, Edit, Trash2, Calendar, Clock } from 'lucide-react';

const TaskList = ({ tasks, onToggleStatus, onEditTask, onDeleteTask }) => {
  if (tasks.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto h-24 w-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <CheckCircle className="h-12 w-12 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks found</h3>
        <p className="text-gray-500">Create your first task to get started!</p>
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
    <div className="space-y-4">
      {tasks.map((task) => (
        <div
          key={task.id}
          className={`card hover:shadow-md transition-shadow ${
            task.status === 'completed' ? 'opacity-75' : ''
          }`}
        >
          <div className="flex items-start space-x-4">
            <button
              onClick={() => onToggleStatus(task)}
              className={`mt-1 flex-shrink-0 transition-colors ${
                task.status === 'completed'
                  ? 'text-green-600 hover:text-green-700'
                  : 'text-gray-400 hover:text-primary-600'
              }`}
            >
              {task.status === 'completed' ? (
                <CheckCircle className="h-5 w-5" />
              ) : (
                <Circle className="h-5 w-5" />
              )}
            </button>

            <div className="flex-1 min-w-0">
              <h3 className={`text-lg font-medium ${
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

              <div className="mt-3 flex items-center space-x-4 text-xs text-gray-500">
                <div className="flex items-center space-x-1">
                  <Clock className="h-3 w-3" />
                  <span>Created {formatDate(task.created_at)}</span>
                </div>
                
                {task.due_date && (
                  <div className={`flex items-center space-x-1 ${
                    isOverdue(task.due_date) && task.status !== 'completed'
                      ? 'text-red-600' 
                      : ''
                  }`}>
                    <Calendar className="h-3 w-3" />
                    <span>Due {formatDate(task.due_date)}</span>
                    {isOverdue(task.due_date) && task.status !== 'completed' && (
                      <span className="text-red-600 font-medium">(Overdue)</span>
                    )}
                  </div>
                )}
              </div>

              <div className="mt-2">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  task.status === 'completed'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {task.status === 'completed' ? 'Completed' : 'Pending'}
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => onEditTask(task)}
                className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                title="Edit task"
              >
                <Edit className="h-4 w-4" />
              </button>
              
              <button
                onClick={() => onDeleteTask(task.id)}
                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Delete task"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TaskList;