import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * ProtectedRoute - Centralized route protection and role-based access
 * 
 * @param {object} props
 * @param {React.ReactNode} props.children - Component to render if authorized
 * @param {string[]} props.allowedRoles - Roles permitted to access (e.g., ['ADMIN', 'TEACHER'])
 * @returns {React.ReactNode}
 */
export const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { isAuthenticated, role, loading } = useAuth();

  // Show loading indicator while session is being restored
  if (loading) {
    // Do not render any additional UI here; routing will handle final render
    return null;
  }

  // Not authenticated → redirect to landing page
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // Check if user's role is allowed
  if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    // Redirect to correct dashboard based on role
    if (role === 'ADMIN') {
      return <Navigate to="/admin/dashboard" replace />;
    } else if (role === 'TEACHER') {
      return <Navigate to="/dashboard" replace />;
    }
    // Fallback: go to landing
    return <Navigate to="/" replace />;
  }

  // Authorized → render component
  return children;
};
