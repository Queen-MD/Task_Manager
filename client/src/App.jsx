import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Dashboard from './components/Dashboard/Dashboard';
import AdminPanel from './components/Admin/AdminPanel';
import { useEffect } from 'react';

// Simple loading component
function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
        <p className="text-gray-600 text-lg">Loading...</p>
      </div>
    </div>
  );
}

// Simple test component to verify React is working
function TestComponent() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">React App is Working!</h1>
        <p className="text-gray-600 mb-4">If you can see this, React is loading correctly.</p>
        <div className="space-y-2">
          <a href="/login" className="block w-full bg-blue-600 text-white text-center py-2 px-4 rounded hover:bg-blue-700">
            Go to Login
          </a>
          <a href="/register" className="block w-full bg-green-600 text-white text-center py-2 px-4 rounded hover:bg-green-700">
            Go to Register
          </a>
        </div>
      </div>
    </div>
  );
}

function App() {
  useEffect(() => {
    console.log('App component mounted');
  }, []);

  // For debugging - uncomment this line to test if React is working
  // return <TestComponent />;

  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="min-h-screen">
            <Routes>
              <Route path="/test" element={<TestComponent />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/admin" element={<AdminRoute><AdminPanel /></AdminRoute>} />
              <Route path="/" element={<Navigate to="/login" />} />
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