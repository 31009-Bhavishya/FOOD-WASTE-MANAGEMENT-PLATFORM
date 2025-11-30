import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Leaf, Users, TrendingDown, Shield } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import './GetStarted.css';

const GetStarted = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Leaf className="feature-icon" />,
      title: "Reduce Food Waste",
      description: "Connect surplus food with those in need and reduce environmental impact"
    },
    {
      icon: <Users className="feature-icon" />,
      title: "Community Impact",
      description: "Build a network of donors and recipients to strengthen food security"
    },
    {
      icon: <TrendingDown className="feature-icon" />,
      title: "Track Progress",
      description: "Monitor food waste reduction and measure your positive impact"
    },
    {
      icon: <Shield className="feature-icon" />,
      title: "Secure Platform",
      description: "Safe and reliable platform for managing food donations"
    }
  ];

  return (
    <div className="getstarted-container">
      <div className="getstarted-content">
        <div className="hero-section">
          <h1 className="hero-title">Food Waste Reduction Platform</h1>
          <p className="hero-subtitle">
            Join us in the mission to reduce food waste and improve food security.
            Connect surplus food with those who need it most.
          </p>
          <button 
            className="cta-button"
            onClick={() => navigate('/login')}
          >
            Get Started
          </button>
        </div>

        <div className="hero-images">
          <div className="image-card">
            <ImageWithFallback 
              src="https://images.unsplash.com/photo-1710093072228-8c3129f27357?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21tdW5pdHklMjBmb29kJTIwZG9uYXRpb258ZW58MXx8fHwxNzY0NDQ1MTU1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
              alt="Community Food Donation"
              className="hero-image"
            />
          </div>
          <div className="image-card">
            <ImageWithFallback 
              src="https://images.unsplash.com/photo-1748342319942-223b99937d4e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMHZlZ2V0YWJsZXMlMjBtYXJrZXR8ZW58MXx8fHwxNzY0Mzg0Mzk0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
              alt="Fresh Vegetables"
              className="hero-image"
            />
          </div>
          <div className="image-card">
            <ImageWithFallback 
              src="https://images.unsplash.com/photo-1760627588119-d741cd0100e6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb29kJTIwd2FzdGUlMjByZWR1Y3Rpb258ZW58MXx8fHwxNzY0Mzk0ODk3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
              alt="Food Waste Reduction"
              className="hero-image"
            />
          </div>
        </div>

        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-card">
              {feature.icon}
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>

        <div className="stats-section">
          <div className="stat-item">
            <h2>40%</h2>
            <p>Food Waste Reduction</p>
          </div>
          <div className="stat-item">
            <h2>10K+</h2>
            <p>Meals Saved</p>
          </div>
          <div className="stat-item">
            <h2>500+</h2>
            <p>Active Partners</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GetStarted;
