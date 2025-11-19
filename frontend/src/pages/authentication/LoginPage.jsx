// LoginPage.jsx
import React, { useState } from 'react';
import InputField from '../../components/core-ui/InputField.jsx';
import Button from '../../components/core-ui/Button.jsx';
import { Link, useNavigate } from 'react-router-dom'; // Assuming you are using react-router-dom
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';

import '../../css/AuthLayout.css';

const LoginPage = () => {
    const navigate = useNavigate()

    const [formData, setFormData] = useState({ email: '', password: '' });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);
        
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/auth/signin/`,{
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(formData)
        })

        const data = await response.json()

        if (response.ok){
            localStorage.setItem("user", data.user);
            localStorage.setItem("access_token", data.access);
            localStorage.setItem("refresh_token", data.refresh);

            alert("Succesfully logged in!")

            navigate('/dashboard')
        }else{
            alert("Something went wrong while logging you in: " + JSON.stringify(data))
        }
    };

    const handleGoogleAuth = async (credentialResponse) => {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/auth/oauth/`,{
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({access_token: credentialResponse.credential})
		})

		const data = await response.json()

		if (response.ok){
			localStorage.setItem("user", data.user);
			localStorage.setItem("access_token", data.access);
			localStorage.setItem("refresh_token", data.reffresh);
			
			alert("Successfuly logged in!")
			navigate('/dashboard')
		}else{
			alert("Something went wrong: " + JSON.stringify(data))
		}
    }

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
            error={error}
          />
          
          {/* Added margin for spacing and fullWidth prop */}
          <div style={{ marginTop: '10px' }}>
            <Button 
              type="submit" 
              variant="primary" 
              size="large" 
              fullWidth 
              loading={isLoading}
              disabled={!formData.email || !formData.password}
            >
              {isLoading ? 'Logging In...' : 'Continue'}
            </Button>
          </div>
        </form>

        {/* Google Login Section */}
        <div className="auth-divider">
            <span>or</span>
        </div>

        <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_OAUTH_CLIENT_ID}>
            <GoogleLogin
                onSuccess={handleGoogleAuth}
            />  
        </GoogleOAuthProvider>

        <p className="auth-link-footer">
          Don't have an account? <Link to="/signup">Sign Up</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;