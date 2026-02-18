import React, { createContext, useState, useContext, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext();

/**
 * AuthProvider - Central authentication state management
 * Manages: user, role, token, session persistence, login/logout
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore session from localStorage on app load
  useEffect(() => {
    restoreSession();
  }, []);

  /**
   * restoreSession - Recover auth state from localStorage
   * Called on app initialization and after logout
   */
  const restoreSession = () => {
    try {
      const savedToken = localStorage.getItem('token') || localStorage.getItem('authToken');
      const savedUser = localStorage.getItem('user');
      const savedRole = localStorage.getItem('role');

      if (savedToken && savedUser && savedRole) {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
        setRole(savedRole);
      }
    } catch (error) {
      console.error('Error restoring session:', error);
      // Clear corrupted data
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('role');
    } finally {
      setLoading(false);
    }
  };

  /**
   * login - Authenticate user via email, password, and role
   * @param {string} email - User email
   * @param {string} password - User password
   * @param {string} role - 'ADMIN' or 'TEACHER'
   * @returns {Promise<object>} User object
   * @throws {Error} If login fails
   */
  const login = async (email, password, role) => {
    try {
      let response;

      if (role === 'ADMIN') {
        response = await authService.adminLogin(email, password);
      } else if (role === 'TEACHER') {
        response = await authService.teacherLogin(email, password);
      } else {
        throw new Error('Invalid role. Must be ADMIN or TEACHER.');
      }

      const { token: newToken, user: userData } = response;

      // Persist to localStorage
      localStorage.setItem('token', newToken);
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('role', role);

      // Update state
      setToken(newToken);
      setUser(userData);
      setRole(role);

      return userData;
    } catch (error) {
      // Propagate error to UI
      throw error;
    }
  };

  /**
   * logout - Clear all authentication state and localStorage
   */
  const logout = () => {
    // Clear state
    setToken(null);
    setUser(null);
    setRole(null);

    // Clear localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('role');
  };

  const isAuthenticated = !!token;

  const value = {
    user,
    role,
    token,
    isAuthenticated,
    loading,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * useAuth - Hook to access auth context from any component
 * @returns {object} Auth context with user, role, token, isAuthenticated, loading, login, logout
 * @throws {Error} If used outside AuthProvider
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
