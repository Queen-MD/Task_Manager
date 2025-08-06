import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Dashboard from './components/Dashboard/Dashboard';
import AdminPanel from './components/Admin/AdminPanel';
import DebugPage from './components/Debug/DebugPage';
import { useEffect } from 'react';

// Loading component
function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
        <p className="text-gray-600 text-lg">Loading...</p>
      </div>
    </div>
  );
}

function App() {
  useEffect(() => {
    console.log('App component mounted');
    
    // Test API connection
    const testConnection = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/health');
        if (response.ok) {
          console.log('Backend connection successful');
        } else {
          console.error('Backend connection failed:', response.status);
        }
      } catch (error) {
        console.error('Backend connection error:', error);
        console.log('Make sure your backend server is running on http://localhost:5000');
      }
    };
    
    testConnection();
  }, []);

  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="min-h-screen transition-colors duration-300">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/debug" element={<DebugPage />} />
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/admin" element={<AdminRoute><AdminPanel /></AdminRoute>} />
              <Route path="/" element={<Navigate to="/dashboard" />} />
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

// Protected route component
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <LoadingSpinner />;
  }
  
  return user ? children : <Navigate to="/login" />;
}

// Admin route component
function AdminRoute({ children }) {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <LoadingSpinner />;
  }
  
  return user && user.is_admin ? children : <Navigate to="/dashboard" />;
}

export default App;