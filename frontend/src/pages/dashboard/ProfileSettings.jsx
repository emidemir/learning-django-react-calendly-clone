// ProfileSettings.jsx
import React, { useState } from 'react';
import Layout from '../../components/layout/Layout.jsx';
import InputField from '../../components/core-ui/InputField.jsx';
import Button from '../../components/core-ui/Button.jsx';
import '../../css/ProfileSettings.css';

const mockProfile = {
    fullName: 'John Doe',
    username: 'john-doe',
    email: 'john.doe@example.com',
    profilePicture: 'https://via.placeholder.com/150',
};

const ProfileSettings = () => {
    const [profile, setProfile] = useState(mockProfile);
    const [passwordData, setPasswordData] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });
    const [isSavingProfile, setIsSavingProfile] = useState(false);
    const [isChangingPassword, setIsChangingPassword] = useState(false);

    const handleProfileChange = (e) => {
        setProfile({ ...profile, [e.target.name]: e.target.value });
    };

    const handlePasswordChange = (e) => {
        setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
    };

    const handleSaveProfile = (e) => {
        e.preventDefault();
        setIsSavingProfile(true);
        console.log('Saving Profile:', profile);
        setTimeout(() => {
            setIsSavingProfile(false);
            alert('Profile updated successfully!');
        }, 1500);
    };

    const handleChangePassword = (e) => {
        e.preventDefault();
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            alert('New passwords do not match!');
            return;
        }
        setIsChangingPassword(true);
        console.log('Changing Password:', passwordData);
        setTimeout(() => {
            setIsChangingPassword(false);
            setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
            alert('Password changed successfully!');
        }, 1500);
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
                            label="Full Name"
                            name="fullName"
                            value={profile.fullName}
                            onChange={handleProfileChange}
                            required
                        />
                        <InputField
                            label="Profile URL Slug"
                            name="username"
                            value={profile.username}
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