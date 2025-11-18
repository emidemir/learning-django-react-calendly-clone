// SignupPage.jsx
import React, { useState } from 'react';
import InputField from '../../components/core-ui/InputField.jsx';
import Button from '../../components/core-ui/Button.jsx';
import { Link } from 'react-router-dom'; // Assuming you are using react-router-dom

const SignupPage = () => {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
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
    console.log('Attempting signup with:', formData);

    setTimeout(() => {
        // Simulate signup success/failure (e.g., email already exists)
        if (formData.username === 'existing') {
             setError("Username already taken. Please choose another.");
        } else {
             console.log("Signup successful!");
             // Redirect to login page
        }
        setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Create Your Account</h2>
        <form onSubmit={handleSubmit}>
          <InputField
            label="Username"
            name="username"
            type="text"
            value={formData.username}
            onChange={handleChange}
            placeholder="e.g., yourname"
          />
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
            error={error} 
          />
          <Button 
            type="submit" 
            variant="primary" 
            size="large" 
            loading={isLoading}
            disabled={!formData.username || !formData.email || !formData.password}
          >
            {isLoading ? 'Creating Account...' : 'Get Started'}
          </Button>
        </form>
        <p className="auth-link-footer">
          Already have an account? <Link to="/login">Log In</Link>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;