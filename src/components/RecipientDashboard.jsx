import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Search, MapPin, Calendar, Package, CheckCircle } from 'lucide-react';
import './RecipientDashboard.css';

const RecipientDashboard = () => {
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  const [donations, setDonations] = useState([]);
  const [requests, setRequests] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const allDonations = JSON.parse(localStorage.getItem('donations') || '[]');
    const availableDonations = allDonations.filter(d => d.status === 'available');
    setDonations(availableDonations);

    const allRequests = JSON.parse(localStorage.getItem('requests') || '[]');
    const userRequests = allRequests.filter(r => r.recipientEmail === currentUser.email);
    setRequests(userRequests);
  };

  const handleRequest = (donation) => {
    if (window.confirm('Do you want to request this donation?')) {
      const allRequests = JSON.parse(localStorage.getItem('requests') || '[]');
      
      const newRequest = {
        id: Date.now().toString(),
        donationId: donation.id,
        recipientEmail: currentUser.email,
        recipientName: currentUser.name,
        donorEmail: donation.donorEmail,
        donorName: donation.donorName,
        foodType: donation.foodType,
        quantity: donation.quantity,
        unit: donation.unit,
        pickupLocation: donation.pickupLocation,
        status: 'requested',
        requestedAt: new Date().toISOString()
      };

      allRequests.push(newRequest);
      localStorage.setItem('requests', JSON.stringify(allRequests));

      // Update donation status
      const allDonations = JSON.parse(localStorage.getItem('donations') || '[]');
      const updatedDonations = allDonations.map(d =>
        d.id === donation.id ? { ...d, status: 'claimed' } : d
      );
      localStorage.setItem('donations', JSON.stringify(updatedDonations));

      loadData();
    }
  };

  const handleComplete = (requestId) => {
    if (window.confirm('Mark this request as completed?')) {
      const allRequests = JSON.parse(localStorage.getItem('requests') || '[]');
      const updatedRequests = allRequests.map(r =>
        r.id === requestId ? { ...r, status: 'completed', completedAt: new Date().toISOString() } : r
      );
      localStorage.setItem('requests', JSON.stringify(updatedRequests));
      loadData();
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    navigate('/login');
  };

  const filteredDonations = donations.filter(d =>
    d.foodType.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.pickupLocation.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStats = () => {
    const totalRequests = requests.length;
    const completedRequests = requests.filter(r => r.status === 'completed').length;
    const pendingRequests = requests.filter(r => r.status === 'requested').length;

    return { totalRequests, completedRequests, pendingRequests };
  };

  const stats = getStats();

  return (
    <div className="recipient-dashboard-container">
      <div className="recipient-dashboard-header">
        <div className="header-content">
          <div>
            <h1>Recipient Dashboard</h1>
            <p>Welcome back, {currentUser.name}!</p>
          </div>
          <button onClick={handleLogout} className="logout-button">
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </div>

      <div className="recipient-stats-container">
        <div className="recipient-stat-card">
          <Package className="stat-icon" />
          <div>
            <h3>{stats.totalRequests}</h3>
            <p>Total Requests</p>
          </div>
        </div>
        <div className="recipient-stat-card">
          <CheckCircle className="stat-icon" />
          <div>
            <h3>{stats.completedRequests}</h3>
            <p>Completed</p>
          </div>
        </div>
        <div className="recipient-stat-card">
          <Calendar className="stat-icon" />
          <div>
            <h3>{stats.pendingRequests}</h3>
            <p>Pending</p>
          </div>
        </div>
      </div>

      <div className="recipient-content-section">
        <div className="section-header">
          <h2>Available Donations</h2>
          <div className="search-wrapper">
            <Search className="search-icon" size={20} />
            <input
              type="text"
              placeholder="Search by food type or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
        </div>

        <div className="recipient-donations-grid">
          {filteredDonations.length === 0 ? (
            <div className="recipient-empty-state">
              <Package size={64} />
              <h3>No donations available</h3>
              <p>Check back later for new food donations</p>
            </div>
          ) : (
            filteredDonations.map(donation => (
              <div key={donation.id} className="recipient-donation-card">
                <h3>{donation.foodType}</h3>
                <div className="recipient-card-details">
                  <p><Package size={16} /> {donation.quantity} {donation.unit}</p>
                  <p><Calendar size={16} /> Expires: {new Date(donation.expiryDate).toLocaleDateString()}</p>
                  <p><MapPin size={16} /> {donation.pickupLocation}</p>
                  {donation.description && (
                    <p className="description">{donation.description}</p>
                  )}
                  <p className="donor-info">Donor: {donation.donorName}</p>
                </div>
                <button
                  onClick={() => handleRequest(donation)}
                  className="request-button"
                >
                  Request Donation
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="recipient-content-section">
        <h2>My Requests</h2>
        <div className="recipient-requests-list">
          {requests.length === 0 ? (
            <div className="recipient-empty-state">
              <Package size={64} />
              <h3>No requests yet</h3>
              <p>Request available donations to get started</p>
            </div>
          ) : (
            requests.map(request => (
              <div key={request.id} className="recipient-request-card">
                <div className="request-header">
                  <h3>{request.foodType}</h3>
                  <span className={`recipient-status-badge ${request.status}`}>
                    {request.status}
                  </span>
                </div>
                <div className="request-details">
                  <p><strong>Quantity:</strong> {request.quantity} {request.unit}</p>
                  <p><strong>Donor:</strong> {request.donorName}</p>
                  <p><strong>Location:</strong> {request.pickupLocation}</p>
                  <p><strong>Requested:</strong> {new Date(request.requestedAt).toLocaleDateString()}</p>
                  {request.completedAt && (
                    <p><strong>Completed:</strong> {new Date(request.completedAt).toLocaleDateString()}</p>
                  )}
                </div>
                {request.status === 'requested' && (
                  <button
                    onClick={() => handleComplete(request.id)}
                    className="complete-button"
                  >
                    <CheckCircle size={16} />
                    Mark as Completed
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default RecipientDashboard;
