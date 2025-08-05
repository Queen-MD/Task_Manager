import { useState, useEffect } from 'react';
import { X, Save, Calendar, FileText, Type, Sparkles } from 'lucide-react';

const TaskForm = ({ task, onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    due_date: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || '',
        description: task.description || '',
        due_date: task.due_date ? task.due_date.split('T')[0] : ''
      });
    }
  }, [task]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Task title is required';
    } else if (formData.title.length < 3) {
      newErrors.title = 'Title must be at least 3 characters long';
    }
    
    if (formData.due_date) {
      const selectedDate = new Date(formData.due_date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate < today) {
        newErrors.due_date = 'Due date cannot be in the past';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    await onSubmit(formData);
    setLoading(false);
  };

  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  return (
    <div className="modal-backdrop flex items-center justify-center p-4">
      <div className="modal-content max-w-lg w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-8 border-b border-gray-200/50 dark:border-gray-700/50 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 dark:from-blue-900/20 dark:to-indigo-900/20">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-500 dark:to-indigo-500 rounded-xl">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold gradient-text">
                {task ? 'Edit Task' : 'Create New Task'}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {task ? 'Update your task details' : 'Add a new task to your workflow'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl p-2 transition-all duration-200 hover:scale-110 focus-ring"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {/* Task Title */}
          <div className="animate-slide-in-left">
            <label htmlFor="title" className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
              Task Title *
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Type className="h-5 w-5 text-gray-400 dark:text-gray-500 group-focus-within:text-blue-500 dark:group-focus-within:text-blue-400 transition-colors duration-200" />
              </div>
              <input
                type="text"
                id="title"
                name="title"
                required
                className={`input-field pl-12 ${errors.title ? 'ring-red-500 dark:ring-red-400 border-red-500 dark:border-red-400' : 'group-focus-within:ring-blue-500 dark:group-focus-within:ring-blue-400'}`}
                placeholder="Enter a descriptive task title"
                value={formData.title}
                onChange={handleChange}
              />
            </div>
            {errors.title && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center space-x-1">
                <span className="w-1 h-1 bg-red-500 dark:bg-red-400 rounded-full"></span>
                <span>{errors.title}</span>
              </p>
            )}
          </div>

          {/* Description */}
          <div className="animate-slide-in-right">
            <label htmlFor="description" className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
              Description
            </label>
            <div className="relative group">
              <div className="absolute top-3 left-0 pl-4 flex items-start pointer-events-none">
                <FileText className="h-5 w-5 text-gray-400 dark:text-gray-500 group-focus-within:text-blue-500 dark:group-focus-within:text-blue-400 transition-colors duration-200" />
              </div>
              <textarea
                id="description"
                name="description"
                rows={4}
                className="input-field pl-12 resize-none group-focus-within:ring-blue-500 dark:group-focus-within:ring-blue-400"
                placeholder="Add more details about this task (optional)"
                value={formData.description}
                onChange={handleChange}
              />
            </div>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Provide additional context or requirements for this task
            </p>
          </div>

          {/* Due Date */}
          <div className="animate-slide-in-left">
            <label htmlFor="due_date" className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
              Due Date
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Calendar className="h-5 w-5 text-gray-400 dark:text-gray-500 group-focus-within:text-blue-500 dark:group-focus-within:text-blue-400 transition-colors duration-200" />
              </div>
              <input
                type="date"
                id="due_date"
                name="due_date"
                min={getTodayDate()}
                className={`input-field pl-12 ${errors.due_date ? 'ring-red-500 dark:ring-red-400 border-red-500 dark:border-red-400' : 'group-focus-within:ring-blue-500 dark:group-focus-within:ring-blue-400'}`}
                value={formData.due_date}
                onChange={handleChange}
              />
            </div>
            {errors.due_date && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center space-x-1">
                <span className="w-1 h-1 bg-red-500 dark:bg-red-400 rounded-full"></span>
                <span>{errors.due_date}</span>
              </p>
            )}
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Set a deadline to help prioritize this task
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4 pt-6 border-t border-gray-200/50 dark:border-gray-700/50">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              <span className="flex items-center justify-center space-x-2">
                {loading ? (
                  <>
                    <div className="spinner"></div>
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    <span>{task ? 'Update Task' : 'Create Task'}</span>
                  </>
                )}
              </span>
            </button>
            
            <button
              type="button"
              onClick={onClose}
              className="flex-1 btn-secondary hover-lift"
            >
              Cancel
            </button>
          </div>
        </form>

        {/* Tips */}
        <div className="px-8 pb-8">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-4 border border-blue-200/50 dark:border-blue-700/50">
            <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-300 mb-2">💡 Pro Tips</h4>
            <ul className="text-xs text-blue-800 dark:text-blue-300 space-y-1">
              <li>• Use clear, action-oriented titles (e.g., "Review quarterly report")</li>
              <li>• Add context in the description to remember important details</li>
              <li>• Set realistic due dates to maintain productivity momentum</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskForm;