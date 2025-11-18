// Navbar.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../core-ui/Button.jsx';
import '../../css/Navbar.css'; // Correct relative import from components/layout

const Navbar = ({ isLoggedIn }) => {
  return (
    <nav className="navbar">
      <div className="navbar__logo">
        <Link to={isLoggedIn ? "/dashboard" : "/"}>
          {/* Use a placeholder logo/text */}
          <h1>🗓️ CloneApp</h1>
        </Link>
      </div>

      <div className="navbar__links">
        {isLoggedIn ? (
          <>
            <Link to="/settings/profile" className="navbar__link">Settings</Link>
            <Button variant="secondary" onClick={() => console.log('Logout action')}>
              Log Out
            </Button>
          </>
        ) : (
          <>
            <Link to="/login" className="navbar__link">Log In</Link>
            <Link to="/signup">
              <Button variant="primary" size="small">
                Sign Up
              </Button>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;