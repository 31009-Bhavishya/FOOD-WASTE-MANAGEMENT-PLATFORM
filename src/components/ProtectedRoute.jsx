import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, requiredRole }) => {
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  if (requiredRole && currentUser.role !== requiredRole) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute;
