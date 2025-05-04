import React from 'react';
import logo from './logo/load.png';
import './LoadingSpinner.css';
const LoadingSpinner = () => {
  return (
    <div className="spinner-container">
    <img src={logo} alt="Loading..." className="spinner-logo" />
    </div>
  );
};

export default LoadingSpinner;
