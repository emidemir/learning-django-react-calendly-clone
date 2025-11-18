// NotificationToast.jsx
import React, { useState, useEffect, useCallback } from 'react';
import '../../css/NotificationToast.css'; // Correct relative import

const NotificationToast = ({ message, type = 'info', duration = 3000, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);
  
  const handleClose = useCallback(() => {
    setIsVisible(false);
    if (onClose) {
      setTimeout(onClose, 300); // Wait for the fade-out animation
    }
  }, [onClose]);

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(handleClose, duration);
      return () => clearTimeout(timer); // Cleanup timer on component unmount or change
    }
  }, [duration, isVisible, handleClose]);

  if (!isVisible && !message) return null; // Only render if visible or closing

  return (
    <div className={`toast toast--${type} ${isVisible ? 'toast--visible' : 'toast--hidden'}`}>
      <p>{message}</p>
      <button className="toast-close" onClick={handleClose}>&times;</button>
    </div>
  );
};

// Note: In a real app, this is often managed by a global context/provider.
export default NotificationToast;