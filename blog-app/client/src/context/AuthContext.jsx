import React, { createContext, useState, useEffect, useCallback } from 'react';
import * as authService from '../services/authService'; // Note: Fixed typo in filename (authServices -> authService)
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types'; // For prop-type validation

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => authService.getCurrentUser()); // Lazy initialization
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [isAuthenticating, setIsAuthenticating] = useState(false); // Loading state
  const navigate = useNavigate();

  // Token sync with localStorage
  useEffect(() => {
    token ? localStorage.setItem('token', token) : localStorage.removeItem('token');
  }, [token]);

  const login = useCallback(async (email, password) => {
    try {
      setIsAuthenticating(true);
      const { token: jwt, user: userData } = await authService.login(email, password);
      setToken(jwt);
      setUser(userData);
      navigate('/home'); // Redirect after login
    } catch (error) {
      console.error('Login failed:', error);
      throw error; // Re-throw for UI error handling
    } finally {
      setIsAuthenticating(false);
    }
  }, [navigate]);

  const register = useCallback(async (first, last, email, pass) => {
    try {
      setIsAuthenticating(true);
      const { token: jwt, user: userData } = await authService.register(first, last, email, pass);
      setToken(jwt);
      setUser(userData);
      navigate('/home'); // Redirect after registration
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    } finally {
      setIsAuthenticating(false);
    }
  }, [navigate]);

  const logout = useCallback(() => {
    authService.logout();
    setToken(null);
    setUser(null);
    navigate('/login'); // Redirect to login after logout
  }, [navigate]);

  // Value to provide to consumers
  const contextValue = {
    user,
    token,
    isAuthenticating,
    login,
    register,
    logout,
    isAuthenticated: !!token // Derived state
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Prop validation
AuthProvider.propTypes = {
  children: PropTypes.node.isRequired
};