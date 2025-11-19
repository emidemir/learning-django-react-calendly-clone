// Navbar.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../core-ui/Button.jsx';
import '../../css/Navbar.css'; // Correct relative import from components/layout

const Navbar = ({ isLoggedIn }) => {

	const navigate = useNavigate();
	
	const handleLogout = async () => {
		const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/auth/logout/`,{
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"Authorization": `Bearer ${localStorage.getItem("access_token")}`,
			},
			body: JSON.stringify({
                refresh: localStorage.getItem('refresh_token'),  // Send refresh token in body
            })
		});

		if (response.ok){
			localStorage.clear();
			navigate('/login');
		}else{
			const data = await response.json();
            alert(`Logout failed: ${data.error || 'Unknown error'}`);
		}
	}

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
              <Button variant="secondary" onClick={handleLogout}>
                Log Out
              </Button>
            </>
          ) : (
            <>
              <Link to="/login" className="navbar__link">Log In</Link>
              <Link to="/signup">
                <Button variant="primary" size="small" >
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