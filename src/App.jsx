import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import GetStarted from './components/GetStarted';
import Login from './components/Login';
import Register from './components/Register';
import DonorDashboard from './components/DonorDashboard';
import RecipientDashboard from './components/RecipientDashboard';
import AnalystDashboard from './components/AnalystDashboard';
import AdminDashboard from './components/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import './styles/globals.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<GetStarted />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        <Route 
          path="/donor-dashboard" 
          element={
            <ProtectedRoute requiredRole="donor">
              <DonorDashboard />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/recipient-dashboard" 
          element={
            <ProtectedRoute requiredRole="recipient">
              <RecipientDashboard />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/analyst-dashboard" 
          element={
            <ProtectedRoute requiredRole="analyst">
              <AnalystDashboard />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/admin-dashboard" 
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />
        
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
