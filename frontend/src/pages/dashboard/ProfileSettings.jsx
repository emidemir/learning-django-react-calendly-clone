// ProfileSettings.jsx
import React, { useEffect, useState } from 'react';
import Layout from '../../components/layout/Layout.jsx';
import InputField from '../../components/core-ui/InputField.jsx';
import Button from '../../components/core-ui/Button.jsx';
import '../../css/ProfileSettings.css';

import { useNavigate } from 'react-router-dom';

const ProfileSettings = () => {

    const navigate = useNavigate();

    const [profile, setProfile] = useState({});
    const [passwordData, setPasswordData] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });
    const [isSavingProfile, setIsSavingProfile] = useState(false);
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    
    const authToken = localStorage.getItem("access_token");
    const userID = JSON.parse(localStorage.getItem("user")).id

    // Fetch profile data
    useEffect(()=> {
        const fetchProfileData = async () => {

            if (!authToken){
                alert("Token expired, you need to login again!");
                navigate("/login");
            }

            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/profiles/${userID}/`,{
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${authToken}`,
                }
            });
            
            const data = await response.json();
            console.log(data)
            
            if (response.ok){
                setProfile({
                    first_name: data.first_name,
                    last_name: data.last_name,
                    username: data.username,
                    email: data.email,
                    profilePicture: `${process.env.REACT_APP_BACKEND_URL}${data.img_url}`,
                    bio: data.bio
                })
                console.log(data)
            }else{
                alert("Something went wrong when fetching profile data: " + JSON.stringify(data))
            }
        };

        fetchProfileData();
    },[authToken, userID])

    const handleProfileChange = (e) => {
        setProfile({ ...profile, [e.target.name]: e.target.value });
    };

    const handlePasswordChange = (e) => {
        setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
    };

    const handleSaveProfile = async (e) => {
        e.preventDefault();
        setIsSavingProfile(true);
        
        const payload = {
            ...profile,
            
        }

        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/profiles/${userID}`,{
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${authToken}`,
            },
            body: JSON.stringify()
        })

    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            alert('New passwords do not match!');
            return;
        }else{
            const payload = {
                ...profile,
                current_password: passwordData.oldPassword,
                new_password: passwordData.confirmPassword,
            };

            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/profiles/${userID}/`,{
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${authToken}`,
                },
                body: JSON.stringify(payload)
            });
            const data = response.json();

            if (response.ok){
                alert("Password changed succesfully!");
            }else{
                alert("Something went wrong!");
            }
        }
    };

    return (
        <Layout useDashboardLayout={true} isLoggedIn={true}>
            <div className="settings-page-container profile-container">
                <h2>Account Settings ⚙️</h2>

                <section className="settings-section profile-details-section">
                    <h3>Personal Details</h3>
                    <form onSubmit={handleSaveProfile}>
                        <div className="profile-image-section">
                            <img src={profile.profilePicture} alt="Profile" className="profile-avatar-large" />
                            <Button variant="secondary" size="small">Change Photo</Button>
                        </div>
                        <InputField
                            label="First Name"
                            name="first_name"
                            value={profile.first_name}
                            onChange={handleProfileChange}
                            required
                        />
                        <InputField
                            label="Last Name"
                            name="last_name"
                            value={profile.last_name}
                            onChange={handleProfileChange}
                            required
                        />
                        <InputField
                            label="Email (Read-Only)"
                            name="email"
                            value={profile.email}
                            disabled
                        />
                        <div className="save-button-container">
                            <Button type="submit" variant="primary" loading={isSavingProfile}>
                                {isSavingProfile ? 'Saving...' : 'Save Profile'}
                            </Button>
                        </div>
                    </form>
                </section>

                <section className="settings-section password-section">
                    <h3>Change Password</h3>
                    <form onSubmit={handleChangePassword}>
                        <InputField
                            label="Current Password"
                            name="oldPassword"
                            type="password"
                            value={passwordData.oldPassword}
                            onChange={handlePasswordChange}
                            required
                        />
                        <InputField
                            label="New Password"
                            name="newPassword"
                            type="password"
                            value={passwordData.newPassword}
                            onChange={handlePasswordChange}
                            required
                        />
                        <InputField
                            label="Confirm New Password"
                            name="confirmPassword"
                            type="password"
                            value={passwordData.confirmPassword}
                            onChange={handlePasswordChange}
                            required
                        />
                        <div className="save-button-container">
                            <Button type="submit" variant="secondary" loading={isChangingPassword}>
                                {isChangingPassword ? 'Changing...' : 'Change Password'}
                            </Button>
                        </div>
                    </form>
                </section>
            </div>
        </Layout>
    );
};

export default ProfileSettings;