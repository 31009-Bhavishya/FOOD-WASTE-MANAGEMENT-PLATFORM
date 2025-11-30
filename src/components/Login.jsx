import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LogIn, Mail, Lock, AlertCircle, Home } from 'lucide-react';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'donor'
  });
  const [errors, setErrors] = useState({});
  const [loginError, setLoginError] = useState('');

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
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
    setLoginError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoginError('');

    if (!validateForm()) {
      return;
    }

    // Check for admin credentials
    if (formData.role === 'admin') {
      if (formData.email === 'admin@foodwaste.com' && formData.password === 'admin123') {
        const userData = {
          email: formData.email,
          role: 'admin',
          name: 'Admin User'
        };
        localStorage.setItem('currentUser', JSON.stringify(userData));
        navigate('/admin-dashboard');
        return;
      } else {
        setLoginError('Invalid admin credentials. Admin access is restricted.');
        return;
      }
    }

    // Get users from localStorage
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    // Find user
    const user = users.find(u => 
      u.email === formData.email && 
      u.password === formData.password && 
      u.role === formData.role
    );

    if (user) {
      // Store current user
      localStorage.setItem('currentUser', JSON.stringify({
        email: user.email,
        role: user.role,
        name: user.name
      }));

      // Navigate based on role
      switch (user.role) {
        case 'donor':
          navigate('/donor-dashboard');
          break;
        case 'recipient':
          navigate('/recipient-dashboard');
          break;
        case 'analyst':
          navigate('/analyst-dashboard');
          break;
        default:
          navigate('/');
      }
    } else {
      setLoginError('Invalid email, password, or role. Please check your credentials and try again.');
    }
  };

  return (
    <div className="login-container">
      <button onClick={() => navigate('/')} className="home-button">
        <Home size={20} />
        Back to Home
      </button>
      <div className="login-card">
        <div className="login-header">
          <LogIn className="login-icon" />
          <h2>Welcome Back</h2>
          <p>Log in to continue reducing food waste</p>
        </div>

        {loginError && (
          <div className="error-banner">
            <AlertCircle size={20} />
            <span>{loginError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="role">Login As</label>
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
              <option value="admin">Admin</option>
            </select>
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
                placeholder="Enter your password"
                className={errors.password ? 'input-error' : ''}
              />
            </div>
            {errors.password && <span className="error-text">{errors.password}</span>}
          </div>

          <button type="submit" className="submit-button">
            Log In
          </button>
        </form>

        <div className="login-footer">
          <p>Don't have an account? <Link to="/register">Register here</Link></p>
          {formData.role === 'admin' && (
            <p className="admin-note">Admin access is restricted to authorized personnel only</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
