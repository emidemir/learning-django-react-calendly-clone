// LoginPage.jsx
import React, { useState } from 'react';
import InputField from '../../components/core-ui/InputField.jsx';
import Button from '../../components/core-ui/Button.jsx';
import { Link } from 'react-router-dom'; // Assuming you are using react-router-dom

// We'll create a dedicated CSS file for Auth layouts later, but for now, use App.css
// import '../../css/AuthLayout.css'; 

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    
    // Placeholder for API call: Will be replaced with Django backend call later
    console.log('Attempting login with:', formData);
    
    setTimeout(() => {
        // Simulate login success/failure
        if (formData.email === 'test@user.com' && formData.password === 'password') {
             console.log("Login successful!");
             // Redirect to dashboard (DashboardHome.jsx route: /dashboard)
        } else {
             setError("Invalid credentials. Please try again.");
        }
        setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Log In to Your Account</h2>
        <form onSubmit={handleSubmit}>
          <InputField
            label="Email Address"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="you@example.com"
          />
          <InputField
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="********"
            error={error} // Display general error here
          />
          <Button 
            type="submit" 
            variant="primary" 
            size="large" 
            loading={isLoading}
            disabled={!formData.email || !formData.password}
          >
            {isLoading ? 'Logging In...' : 'Continue'}
          </Button>
        </form>
        <p className="auth-link-footer">
          Don't have an account? <Link to="/signup">Sign Up</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;