import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, TrendingUp, TrendingDown, Users, Package, BarChart3, PieChart } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart as RePieChart, Pie, Cell, LineChart, Line } from 'recharts';
import './AnalystDashboard.css';

const AnalystDashboard = () => {
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    calculateAnalytics();
  }, []);

  const calculateAnalytics = () => {
    const donations = JSON.parse(localStorage.getItem('donations') || '[]');
    const requests = JSON.parse(localStorage.getItem('requests') || '[]');
    const users = JSON.parse(localStorage.getItem('users') || '[]');

    // Total stats
    const totalDonations = donations.length;
    const totalQuantity = donations.reduce((sum, d) => sum + parseFloat(d.quantity || 0), 0);
    const availableDonations = donations.filter(d => d.status === 'available').length;
    const claimedDonations = donations.filter(d => d.status === 'claimed').length;

    // User stats
    const donors = users.filter(u => u.role === 'donor').length;
    const recipients = users.filter(u => u.role === 'recipient').length;

    // Food type distribution
    const foodTypeCount = {};
    donations.forEach(d => {
      foodTypeCount[d.foodType] = (foodTypeCount[d.foodType] || 0) + 1;
    });

    const foodTypeData = Object.entries(foodTypeCount).map(([name, value]) => ({
      name,
      value
    }));

    // Monthly trend (simulated)
    const monthlyData = [
      { month: 'Jan', donations: 12, quantity: 45 },
      { month: 'Feb', donations: 19, quantity: 67 },
      { month: 'Mar', donations: 15, quantity: 52 },
      { month: 'Apr', donations: 25, quantity: 89 },
      { month: 'May', donations: 22, quantity: 78 },
      { month: 'Jun', donations: totalDonations, quantity: totalQuantity }
    ];

    // Status distribution
    const statusData = [
      { name: 'Available', value: availableDonations },
      { name: 'Claimed', value: claimedDonations }
    ];

    // Completion rate
    const completedRequests = requests.filter(r => r.status === 'completed').length;
    const completionRate = requests.length > 0 ? ((completedRequests / requests.length) * 100).toFixed(1) : 0;

    setAnalytics({
      totalDonations,
      totalQuantity: totalQuantity.toFixed(1),
      availableDonations,
      claimedDonations,
      donors,
      recipients,
      completionRate,
      foodTypeData,
      monthlyData,
      statusData,
      totalRequests: requests.length,
      completedRequests
    });
  };

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    navigate('/login');
  };

  const COLORS = ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#ffecd2', '#fcb69f'];

  if (!analytics) {
    return (
      <div className="analyst-dashboard-container">
        <div className="loading">Loading analytics...</div>
      </div>
    );
  }

  return (
    <div className="analyst-dashboard-container">
      <div className="analyst-dashboard-header">
        <div className="header-content">
          <div>
            <h1>Data Analyst Dashboard</h1>
            <p>Welcome back, {currentUser.name}!</p>
          </div>
          <button onClick={handleLogout} className="logout-button">
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </div>

      <div className="analyst-stats-container">
        <div className="analyst-stat-card">
          <Package className="stat-icon" />
          <div>
            <h3>{analytics.totalDonations}</h3>
            <p>Total Donations</p>
          </div>
        </div>
        <div className="analyst-stat-card">
          <TrendingUp className="stat-icon" />
          <div>
            <h3>{analytics.totalQuantity} kg</h3>
            <p>Food Saved</p>
          </div>
        </div>
        <div className="analyst-stat-card">
          <Users className="stat-icon" />
          <div>
            <h3>{analytics.donors}</h3>
            <p>Active Donors</p>
          </div>
        </div>
        <div className="analyst-stat-card">
          <Users className="stat-icon" />
          <div>
            <h3>{analytics.recipients}</h3>
            <p>Recipients</p>
          </div>
        </div>
      </div>

      <div className="analyst-charts-grid">
        <div className="analyst-chart-card">
          <h3><BarChart3 size={24} /> Monthly Donation Trends</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analytics.monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="donations" fill="#667eea" name="Donations" />
              <Bar dataKey="quantity" fill="#764ba2" name="Quantity (kg)" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="analyst-chart-card">
          <h3><PieChart size={24} /> Food Type Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <RePieChart>
              <Pie
                data={analytics.foodTypeData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {analytics.foodTypeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </RePieChart>
          </ResponsiveContainer>
        </div>

        <div className="analyst-chart-card">
          <h3><PieChart size={24} /> Donation Status</h3>
          <ResponsiveContainer width="100%" height={300}>
            <RePieChart>
              <Pie
                data={analytics.statusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {analytics.statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </RePieChart>
          </ResponsiveContainer>
        </div>

        <div className="analyst-chart-card">
          <h3><TrendingUp size={24} /> Impact Metrics</h3>
          <div className="impact-metrics">
            <div className="metric-item">
              <div className="metric-value">{analytics.completionRate}%</div>
              <div className="metric-label">Completion Rate</div>
            </div>
            <div className="metric-item">
              <div className="metric-value">{analytics.totalRequests}</div>
              <div className="metric-label">Total Requests</div>
            </div>
            <div className="metric-item">
              <div className="metric-value">{analytics.completedRequests}</div>
              <div className="metric-label">Completed</div>
            </div>
            <div className="metric-item">
              <div className="metric-value">{analytics.availableDonations}</div>
              <div className="metric-label">Available Now</div>
            </div>
          </div>
        </div>
      </div>

      <div className="analyst-insights-section">
        <h2>Key Insights</h2>
        <div className="insights-grid">
          <div className="insight-card">
            <TrendingUp className="insight-icon positive" />
            <h3>Waste Reduction</h3>
            <p>
              {analytics.totalQuantity} kg of food saved from waste, equivalent to approximately{' '}
              {(analytics.totalQuantity * 2.5).toFixed(0)} meals.
            </p>
          </div>
          <div className="insight-card">
            <Users className="insight-icon" />
            <h3>Community Growth</h3>
            <p>
              {analytics.donors} active donors and {analytics.recipients} recipient organizations
              working together to reduce food waste.
            </p>
          </div>
          <div className="insight-card">
            <Package className="insight-icon" />
            <h3>Donation Efficiency</h3>
            <p>
              {analytics.completionRate}% completion rate indicates strong coordination between
              donors and recipients.
            </p>
          </div>
          <div className="insight-card">
            <TrendingDown className="insight-icon negative" />
            <h3>Environmental Impact</h3>
            <p>
              Prevented approximately {(analytics.totalQuantity * 2.5).toFixed(1)} kg of CO2
              emissions through food waste reduction.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalystDashboard;
