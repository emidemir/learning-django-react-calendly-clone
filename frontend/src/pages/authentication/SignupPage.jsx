// SignupPage.jsx
import React, { useState } from 'react';
import InputField from '../../components/core-ui/InputField.jsx';
import Button from '../../components/core-ui/Button.jsx';
import { Link } from 'react-router-dom'; // Assuming you are using react-router-dom
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';

import { useNavigate } from "react-router-dom";

import '../../css/AuthLayout.css';

const SignupPage = () => {
	const navigate = useNavigate();

	const [formData, setFormData] = useState({ username: '', email: '', password: '', first_name: '', last_name: ''});
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState(null);

	const handleChange = (e) => {
			setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	// Google OAuth signup
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
			
			alert("Successfuly signed up!")
			navigate('/dashboard')
		}else{
			alert("Something went wrong: " + JSON.stringify(data))
		}
	}

	// Signup form submission
	const handleSubmit = async (e) => {
		e.preventDefault();
		setError(null);
		setIsLoading(true);

		const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/auth/signup/`,{
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(formData)
		});

		const data = await response.json();

		if (response.ok){
			localStorage.setItem("user", JSON.stringify(data.user));
			localStorage.setItem("access_token", data.access);
			localStorage.setItem("refresh_token", data.refresh);

			alert("Successfuly signed up!")

			navigate("/dashboard");
		}else{
			alert("Signup failed:" + JSON.stringify(data))
		}
	};

	return (
		<div className="auth-container">
		<div className="auth-box">
			<h2>Create Your Account</h2>
			<form onSubmit={handleSubmit}>
			<InputField
				label="Firstname"
				name="first_name"
				type="text"
				value={formData.first_name}
				onChange={handleChange}
				placeholder="e.g., your first name"
			/>
			<InputField
				label="Lastname"
				name="last_name"
				type="text"
				value={formData.last_name}
				onChange={handleChange}
				placeholder="e.g., your last name"
			/>
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
			
			<div style={{ marginTop: '10px' }}>
				<Button 
					type="submit" 
					variant="primary" 
					size="large" 
					fullWidth
					loading={isLoading}
					disabled={!formData.username || !formData.email || !formData.password}
				>
					{isLoading ? 'Creating Account...' : 'Get Started'}
				</Button>
			</div>
			</form>

			<div className="auth-divider">
				<span>or</span>
			</div>

			{/* Google Signup Section */}
			<GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_OAUTH_CLIENT_ID}>
				<GoogleLogin
					onSuccess={handleGoogleAuth}
				/>  
			</GoogleOAuthProvider>

			<p className="auth-link-footer">
			Already have an account? <Link to="/login">Log In</Link>
			</p>
		</div>
		</div>
	);
	};

export default SignupPage;