import { useState, useEffect } from 'react';
import axios from 'axios';

const DebugPage = () => {
  const [backendStatus, setBackendStatus] = useState('checking...');
  const [apiUrl, setApiUrl] = useState('');
  const [testResults, setTestResults] = useState([]);

  useEffect(() => {
    const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    setApiUrl(API_BASE_URL);
    
    runTests();
  }, []);

  const runTests = async () => {
    const results = [];
    
    // Test 1: Direct fetch to backend
    try {
      const response = await fetch('http://localhost:5000/api/health');
      if (response.ok) {
        results.push({ test: 'Direct Backend Connection', status: 'SUCCESS', details: 'Backend is reachable' });
        setBackendStatus('connected');
      } else {
        results.push({ test: 'Direct Backend Connection', status: 'FAILED', details: `Status: ${response.status}` });
        setBackendStatus('failed');
      }
    } catch (error) {
      results.push({ test: 'Direct Backend Connection', status: 'ERROR', details: error.message });
      setBackendStatus('error');
    }

    // Test 2: Axios with base URL
    try {
      const response = await axios.get('/health');
      results.push({ test: 'Axios with Proxy', status: 'SUCCESS', details: 'Proxy working correctly' });
    } catch (error) {
      results.push({ test: 'Axios with Proxy', status: 'ERROR', details: error.message });
    }

    // Test 3: Environment variables
    results.push({ 
      test: 'Environment Variables', 
      status: 'INFO', 
      details: `VITE_API_URL: ${import.meta.env.VITE_API_URL || 'not set'}` 
    });

    // Test 4: Local storage
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    results.push({ 
      test: 'Local Storage', 
      status: 'INFO', 
      details: `Token: ${token ? 'exists' : 'none'}, User: ${user ? 'exists' : 'none'}` 
    });

    setTestResults(results);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Debug Information</h1>
        
        <div className="grid gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Connection Status</h2>
            <div className="space-y-2">
              <p><strong>API URL:</strong> {apiUrl}</p>
              <p><strong>Backend Status:</strong> 
                <span className={`ml-2 px-2 py-1 rounded text-sm ${
                  backendStatus === 'connected' ? 'bg-green-100 text-green-800' :
                  backendStatus === 'failed' ? 'bg-red-100 text-red-800' :
                  backendStatus === 'error' ? 'bg-red-100 text-red-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {backendStatus}
                </span>
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Test Results</h2>
            <div className="space-y-3">
              {testResults.map((result, index) => (
                <div key={index} className="border-l-4 pl-4 py-2" style={{
                  borderColor: result.status === 'SUCCESS' ? '#10b981' :
                              result.status === 'ERROR' ? '#ef4444' :
                              result.status === 'FAILED' ? '#f59e0b' : '#6b7280'
                }}>
                  <div className="flex justify-between items-start">
                    <h3 className="font-medium">{result.test}</h3>
                    <span className={`px-2 py-1 rounded text-xs ${
                      result.status === 'SUCCESS' ? 'bg-green-100 text-green-800' :
                      result.status === 'ERROR' ? 'bg-red-100 text-red-800' :
                      result.status === 'FAILED' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {result.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{result.details}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
            <div className="space-y-2">
              <button 
                onClick={runTests}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Re-run Tests
              </button>
              <button 
                onClick={() => {
                  localStorage.clear();
                  window.location.reload();
                }}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 ml-2"
              >
                Clear Storage & Reload
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Instructions</h2>
            <div className="space-y-2 text-sm">
              <p><strong>1. Start Backend:</strong> Navigate to the server folder and run <code className="bg-gray-100 px-1 rounded">npm run server</code></p>
              <p><strong>2. Start Frontend:</strong> Navigate to the client folder and run <code className="bg-gray-100 px-1 rounded">npm run dev</code></p>
              <p><strong>3. Check Ports:</strong> Backend should be on port 5000, Frontend on port 5173</p>
              <p><strong>4. Test Login:</strong> Use admin@example.com / admin123 or user@example.com / user123</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DebugPage;