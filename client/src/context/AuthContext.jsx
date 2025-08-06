import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        console.log('Initializing auth...');
        
        // Set axios base URL - try proxy first, then direct
        axios.defaults.baseURL = '/api';
        
        // Add request interceptor
        axios.interceptors.request.use(
          (config) => {
            console.log('Making request:', config.method?.toUpperCase(), config.url);
            return config;
          },
          (error) => {
            console.error('Request error:', error);
            return Promise.reject(error);
          }
        );

        // Add response interceptor
        axios.interceptors.response.use(
          (response) => {
            console.log('Response received:', response.status, response.config.url);
            return response;
          },
          (error) => {
            console.error('Response error:', error.response?.status, error.response?.data || error.message);
            
            // If proxy fails, try direct connection
            if (error.code === 'ECONNREFUSED' || error.response?.status === 404) {
              console.log('Proxy failed, trying direct connection...');
              axios.defaults.baseURL = 'http://localhost:5000/api';
            }
            
            return Promise.reject(error);
          }
        );
    
        const token = localStorage.getItem('token');
        if (token) {
          console.log('Found existing token');
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          
          const userData = localStorage.getItem('user');
          if (userData) {
            try {
              const parsedUser = JSON.parse(userData);
              setUser(parsedUser);
              console.log('User loaded from localStorage:', parsedUser.email);
            } catch (error) {
              console.error('Error parsing user data:', error);
              localStorage.removeItem('user');
              localStorage.removeItem('token');
            }
          }
        } else {
          console.log('No token found');
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        setLoading(false);
        console.log('Auth initialization complete');
      }
    };

    initializeAuth();
  }, []);

  const login = async (email, password) => {
    try {
      console.log('Attempting login for:', email);
      const response = await axios.post('/auth/login', { email, password });
      const { token, user } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(user);
      
      console.log('Login successful');
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || error.message || 'Login failed' 
      };
    }
  };

  const register = async (name, email, password) => {
    try {
      console.log('Attempting registration for:', email);
      const response = await axios.post('/auth/register', { name, email, password });
      const { token, user } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(user);
      
      console.log('Registration successful');
      return { success: true };
    } catch (error) {
      console.error('Registration error:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || error.message || 'Registration failed' 
      };
    }
  };

  const logout = () => {
    console.log('Logging out user');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};