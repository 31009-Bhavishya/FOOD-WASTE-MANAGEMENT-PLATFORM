import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Plus, Edit2, Trash2, Package, TrendingUp, Users, Calendar } from 'lucide-react';
import './DonorDashboard.css';

const DonorDashboard = () => {
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  const [donations, setDonations] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingDonation, setEditingDonation] = useState(null);
  const [formData, setFormData] = useState({
    foodType: '',
    quantity: '',
    unit: 'kg',
    expiryDate: '',
    pickupLocation: '',
    description: ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    loadDonations();
  }, []);

  const loadDonations = () => {
    const allDonations = JSON.parse(localStorage.getItem('donations') || '[]');
    const userDonations = allDonations.filter(d => d.donorEmail === currentUser.email);
    setDonations(userDonations);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.foodType.trim()) {
      newErrors.foodType = 'Food type is required';
    }

    if (!formData.quantity || formData.quantity <= 0) {
      newErrors.quantity = 'Valid quantity is required';
    }

    if (!formData.expiryDate) {
      newErrors.expiryDate = 'Expiry date is required';
    } else if (new Date(formData.expiryDate) < new Date()) {
      newErrors.expiryDate = 'Expiry date must be in the future';
    }

    if (!formData.pickupLocation.trim()) {
      newErrors.pickupLocation = 'Pickup location is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const allDonations = JSON.parse(localStorage.getItem('donations') || '[]');

    if (editingDonation) {
      // Update existing donation
      const updatedDonations = allDonations.map(d =>
        d.id === editingDonation.id
          ? { ...d, ...formData, updatedAt: new Date().toISOString() }
          : d
      );
      localStorage.setItem('donations', JSON.stringify(updatedDonations));
    } else {
      // Create new donation
      const newDonation = {
        id: Date.now().toString(),
        ...formData,
        donorEmail: currentUser.email,
        donorName: currentUser.name,
        status: 'available',
        createdAt: new Date().toISOString()
      };
      allDonations.push(newDonation);
      localStorage.setItem('donations', JSON.stringify(allDonations));
    }

    loadDonations();
    closeModal();
  };

  const handleEdit = (donation) => {
    setEditingDonation(donation);
    setFormData({
      foodType: donation.foodType,
      quantity: donation.quantity,
      unit: donation.unit,
      expiryDate: donation.expiryDate,
      pickupLocation: donation.pickupLocation,
      description: donation.description || ''
    });
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this donation?')) {
      const allDonations = JSON.parse(localStorage.getItem('donations') || '[]');
      const updatedDonations = allDonations.filter(d => d.id !== id);
      localStorage.setItem('donations', JSON.stringify(updatedDonations));
      loadDonations();
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingDonation(null);
    setFormData({
      foodType: '',
      quantity: '',
      unit: 'kg',
      expiryDate: '',
      pickupLocation: '',
      description: ''
    });
    setErrors({});
  };

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    navigate('/login');
  };

  const getStats = () => {
    const totalDonations = donations.length;
    const totalQuantity = donations.reduce((sum, d) => sum + parseFloat(d.quantity), 0);
    const availableDonations = donations.filter(d => d.status === 'available').length;

    return { totalDonations, totalQuantity, availableDonations };
  };

  const stats = getStats();

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="header-content">
          <div>
            <h1>Food Donor Dashboard</h1>
            <p>Welcome back, {currentUser.name}!</p>
          </div>
          <button onClick={handleLogout} className="logout-button">
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </div>

      <div className="stats-container">
        <div className="stat-card">
          <Package className="stat-icon" />
          <div>
            <h3>{stats.totalDonations}</h3>
            <p>Total Donations</p>
          </div>
        </div>
        <div className="stat-card">
          <TrendingUp className="stat-icon" />
          <div>
            <h3>{stats.totalQuantity.toFixed(1)} kg</h3>
            <p>Food Donated</p>
          </div>
        </div>
        <div className="stat-card">
          <Users className="stat-icon" />
          <div>
            <h3>{stats.availableDonations}</h3>
            <p>Available</p>
          </div>
        </div>
      </div>

      <div className="content-section">
        <div className="section-header">
          <h2>My Donations</h2>
          <button onClick={() => setShowModal(true)} className="add-button">
            <Plus size={20} />
            Add Donation
          </button>
        </div>

        <div className="donations-grid">
          {donations.length === 0 ? (
            <div className="empty-state">
              <Package size={64} />
              <h3>No donations yet</h3>
              <p>Start making a difference by adding your first food donation</p>
            </div>
          ) : (
            donations.map(donation => (
              <div key={donation.id} className="donation-card">
                <div className="card-header">
                  <h3>{donation.foodType}</h3>
                  <span className={`status-badge ${donation.status}`}>
                    {donation.status}
                  </span>
                </div>
                <div className="card-body">
                  <p><strong>Quantity:</strong> {donation.quantity} {donation.unit}</p>
                  <p><strong>Expiry:</strong> {new Date(donation.expiryDate).toLocaleDateString()}</p>
                  <p><strong>Location:</strong> {donation.pickupLocation}</p>
                  {donation.description && (
                    <p><strong>Description:</strong> {donation.description}</p>
                  )}
                </div>
                <div className="card-actions">
                  <button onClick={() => handleEdit(donation)} className="edit-button">
                    <Edit2 size={16} />
                    Edit
                  </button>
                  <button onClick={() => handleDelete(donation.id)} className="delete-button">
                    <Trash2 size={16} />
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingDonation ? 'Edit Donation' : 'Add New Donation'}</h2>
              <button onClick={closeModal} className="close-button">×</button>
            </div>
            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-group">
                <label htmlFor="foodType">Food Type *</label>
                <input
                  type="text"
                  id="foodType"
                  name="foodType"
                  value={formData.foodType}
                  onChange={handleChange}
                  placeholder="e.g., Vegetables, Bread, Dairy"
                  className={errors.foodType ? 'input-error' : ''}
                />
                {errors.foodType && <span className="error-text">{errors.foodType}</span>}
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="quantity">Quantity *</label>
                  <input
                    type="number"
                    id="quantity"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleChange}
                    placeholder="Enter quantity"
                    min="0"
                    step="0.1"
                    className={errors.quantity ? 'input-error' : ''}
                  />
                  {errors.quantity && <span className="error-text">{errors.quantity}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="unit">Unit</label>
                  <select
                    id="unit"
                    name="unit"
                    value={formData.unit}
                    onChange={handleChange}
                  >
                    <option value="kg">kg</option>
                    <option value="lbs">lbs</option>
                    <option value="units">units</option>
                    <option value="servings">servings</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="expiryDate">Expiry Date *</label>
                <input
                  type="date"
                  id="expiryDate"
                  name="expiryDate"
                  value={formData.expiryDate}
                  onChange={handleChange}
                  className={errors.expiryDate ? 'input-error' : ''}
                />
                {errors.expiryDate && <span className="error-text">{errors.expiryDate}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="pickupLocation">Pickup Location *</label>
                <input
                  type="text"
                  id="pickupLocation"
                  name="pickupLocation"
                  value={formData.pickupLocation}
                  onChange={handleChange}
                  placeholder="Enter pickup address"
                  className={errors.pickupLocation ? 'input-error' : ''}
                />
                {errors.pickupLocation && <span className="error-text">{errors.pickupLocation}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="description">Description (Optional)</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Additional details about the food donation"
                  rows="3"
                />
              </div>

              <div className="modal-actions">
                <button type="button" onClick={closeModal} className="cancel-button">
                  Cancel
                </button>
                <button type="submit" className="submit-button">
                  {editingDonation ? 'Update' : 'Add'} Donation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DonorDashboard;
