import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Users, Package, TrendingUp, Settings, Trash2, Shield, AlertTriangle } from 'lucide-react';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  const [users, setUsers] = useState([]);
  const [donations, setDonations] = useState([]);
  const [requests, setRequests] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    // Verify admin access
    if (currentUser?.email !== 'admin@foodwaste.com') {
      navigate('/login');
      return;
    }
    loadData();
  }, []);

  const loadData = () => {
    const allUsers = JSON.parse(localStorage.getItem('users') || '[]');
    const allDonations = JSON.parse(localStorage.getItem('donations') || '[]');
    const allRequests = JSON.parse(localStorage.getItem('requests') || '[]');
    
    setUsers(allUsers);
    setDonations(allDonations);
    setRequests(allRequests);
  };

  const handleDeleteUser = (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      const updatedUsers = users.filter(u => u.id !== userId);
      localStorage.setItem('users', JSON.stringify(updatedUsers));
      loadData();
    }
  };

  const handleDeleteDonation = (donationId) => {
    if (window.confirm('Are you sure you want to delete this donation?')) {
      const updatedDonations = donations.filter(d => d.id !== donationId);
      localStorage.setItem('donations', JSON.stringify(updatedDonations));
      loadData();
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    navigate('/login');
  };

  const getStats = () => {
    const totalUsers = users.length;
    const totalDonations = donations.length;
    const totalRequests = requests.length;
    const totalFood = donations.reduce((sum, d) => sum + parseFloat(d.quantity || 0), 0);

    return { totalUsers, totalDonations, totalRequests, totalFood: totalFood.toFixed(1) };
  };

  const stats = getStats();

  return (
    <div className="admin-dashboard-container">
      <div className="admin-dashboard-header">
        <div className="header-content">
          <div className="admin-title">
            <Shield size={32} />
            <div>
              <h1>Admin Dashboard</h1>
              <p>System Administrator Panel</p>
            </div>
          </div>
          <button onClick={handleLogout} className="logout-button">
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </div>

      <div className="admin-stats-container">
        <div className="admin-stat-card">
          <Users className="stat-icon" />
          <div>
            <h3>{stats.totalUsers}</h3>
            <p>Total Users</p>
          </div>
        </div>
        <div className="admin-stat-card">
          <Package className="stat-icon" />
          <div>
            <h3>{stats.totalDonations}</h3>
            <p>Total Donations</p>
          </div>
        </div>
        <div className="admin-stat-card">
          <TrendingUp className="stat-icon" />
          <div>
            <h3>{stats.totalRequests}</h3>
            <p>Total Requests</p>
          </div>
        </div>
        <div className="admin-stat-card">
          <Package className="stat-icon" />
          <div>
            <h3>{stats.totalFood} kg</h3>
            <p>Food Managed</p>
          </div>
        </div>
      </div>

      <div className="admin-tabs">
        <button
          className={activeTab === 'overview' ? 'tab-active' : ''}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button
          className={activeTab === 'users' ? 'tab-active' : ''}
          onClick={() => setActiveTab('users')}
        >
          Users Management
        </button>
        <button
          className={activeTab === 'donations' ? 'tab-active' : ''}
          onClick={() => setActiveTab('donations')}
        >
          Donations Management
        </button>
      </div>

      {activeTab === 'overview' && (
        <div className="admin-content-section">
          <h2>System Overview</h2>
          <div className="overview-grid">
            <div className="overview-card">
              <h3>User Distribution</h3>
              <div className="user-stats">
                <div className="user-stat-item">
                  <span className="label">Donors:</span>
                  <span className="value">{users.filter(u => u.role === 'donor').length}</span>
                </div>
                <div className="user-stat-item">
                  <span className="label">Recipients:</span>
                  <span className="value">{users.filter(u => u.role === 'recipient').length}</span>
                </div>
                <div className="user-stat-item">
                  <span className="label">Analysts:</span>
                  <span className="value">{users.filter(u => u.role === 'analyst').length}</span>
                </div>
              </div>
            </div>

            <div className="overview-card">
              <h3>Donation Status</h3>
              <div className="user-stats">
                <div className="user-stat-item">
                  <span className="label">Available:</span>
                  <span className="value">{donations.filter(d => d.status === 'available').length}</span>
                </div>
                <div className="user-stat-item">
                  <span className="label">Claimed:</span>
                  <span className="value">{donations.filter(d => d.status === 'claimed').length}</span>
                </div>
                <div className="user-stat-item">
                  <span className="label">Completed:</span>
                  <span className="value">{requests.filter(r => r.status === 'completed').length}</span>
                </div>
              </div>
            </div>

            <div className="overview-card alert">
              <AlertTriangle size={32} />
              <h3>System Health</h3>
              <p>All systems operational</p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'users' && (
        <div className="admin-content-section">
          <h2>User Management</h2>
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Organization</th>
                  <th>Registered</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="empty-row">No users found</td>
                  </tr>
                ) : (
                  users.map(user => (
                    <tr key={user.id}>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td><span className={`role-badge ${user.role}`}>{user.role}</span></td>
                      <td>{user.organization || '-'}</td>
                      <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                      <td>
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="admin-delete-button"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'donations' && (
        <div className="admin-content-section">
          <h2>Donations Management</h2>
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Food Type</th>
                  <th>Quantity</th>
                  <th>Donor</th>
                  <th>Location</th>
                  <th>Expiry</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {donations.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="empty-row">No donations found</td>
                  </tr>
                ) : (
                  donations.map(donation => (
                    <tr key={donation.id}>
                      <td>{donation.foodType}</td>
                      <td>{donation.quantity} {donation.unit}</td>
                      <td>{donation.donorName}</td>
                      <td>{donation.pickupLocation}</td>
                      <td>{new Date(donation.expiryDate).toLocaleDateString()}</td>
                      <td><span className={`status-badge ${donation.status}`}>{donation.status}</span></td>
                      <td>
                        <button
                          onClick={() => handleDeleteDonation(donation.id)}
                          className="admin-delete-button"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
