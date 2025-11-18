// Button.jsx
import React from 'react';
import '../../css/Button.css'; // Correct relative import from components/core-ui

const Button = ({ children, variant = 'primary', size = 'medium', onClick, disabled, loading, type = 'button' }) => {
  const baseClass = 'btn';
  
  // Combine base class with variant and size classes
  const classes = `${baseClass} ${baseClass}--${variant} ${baseClass}--${size} ${disabled || loading ? 'btn--disabled' : ''}`;

  return (
    <button
      className={classes}
      onClick={onClick}
      disabled={disabled || loading}
      type={type}
    >
      {loading ? (
        <span className="btn__spinner"></span> // Placeholder for a simple spinner icon
      ) : (
        children
      )}
    </button>
  );
};

export default Button;