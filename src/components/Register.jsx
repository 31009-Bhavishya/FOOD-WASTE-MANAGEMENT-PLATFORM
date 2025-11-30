import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus, User, Mail, Lock, Building, AlertCircle, CheckCircle, Home } from 'lucide-react';
import './Register.css';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'donor',
    organization: ''
  });
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password must contain uppercase, lowercase, and number';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if ((formData.role === 'recipient' || formData.role === 'donor') && !formData.organization.trim()) {
      newErrors.organization = 'Organization name is required';
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
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    setSuccessMessage('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSuccessMessage('');

    if (!validateForm()) {
      return;
    }

    // Get existing users
    const users = JSON.parse(localStorage.getItem('users') || '[]');

    // Check if email already exists
    const emailExists = users.some(u => u.email === formData.email);
    if (emailExists) {
      setErrors(prev => ({
        ...prev,
        email: 'Email already registered'
      }));
      return;
    }

    // Add new user
    const newUser = {
      id: Date.now().toString(),
      name: formData.name,
      email: formData.email,
      password: formData.password,
      role: formData.role,
      organization: formData.organization,
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));

    // Show success message
    setSuccessMessage('Registration successful! Redirecting to login...');

    // Clear form
    setFormData({
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: 'donor',
      organization: ''
    });

    // Redirect to login after 2 seconds
    setTimeout(() => {
      navigate('/login');
    }, 2000);
  };

  return (
    <div className="register-container">
      <button onClick={() => navigate('/')} className="home-button">
        <Home size={20} />
        Back to Home
      </button>
      <div className="register-card">
        <div className="register-header">
          <UserPlus className="register-icon" />
          <h2>Create Account</h2>
          <p>Join us in reducing food waste</p>
        </div>

        {successMessage && (
          <div className="success-banner">
            <CheckCircle size={20} />
            <span>{successMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="register-form">
          <div className="form-group">
            <label htmlFor="role">Register As</label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="form-select"
            >
              <option value="donor">Food Donor</option>
              <option value="recipient">Recipient Organization</option>
              <option value="analyst">Data Analyst</option>
            </select>
            <p className="helper-text">Note: Admin access is restricted</p>
          </div>

          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <div className="input-wrapper">
              <User className="input-icon" size={20} />
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                className={errors.name ? 'input-error' : ''}
              />
            </div>
            {errors.name && <span className="error-text">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <div className="input-wrapper">
              <Mail className="input-icon" size={20} />
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className={errors.email ? 'input-error' : ''}
              />
            </div>
            {errors.email && <span className="error-text">{errors.email}</span>}
          </div>

          {(formData.role === 'recipient' || formData.role === 'donor') && (
            <div className="form-group">
              <label htmlFor="organization">Organization Name</label>
              <div className="input-wrapper">
                <Building className="input-icon" size={20} />
                <input
                  type="text"
                  id="organization"
                  name="organization"
                  value={formData.organization}
                  onChange={handleChange}
                  placeholder="Enter your organization name"
                  className={errors.organization ? 'input-error' : ''}
                />
              </div>
              {errors.organization && <span className="error-text">{errors.organization}</span>}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="input-wrapper">
              <Lock className="input-icon" size={20} />
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a password"
                className={errors.password ? 'input-error' : ''}
              />
            </div>
            {errors.password && <span className="error-text">{errors.password}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <div className="input-wrapper">
              <Lock className="input-icon" size={20} />
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
                className={errors.confirmPassword ? 'input-error' : ''}
              />
            </div>
            {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
          </div>

          <button type="submit" className="submit-button">
            Create Account
          </button>
        </form>

        <div className="register-footer">
          <p>Already have an account? <Link to="/login">Log in here</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Register;
