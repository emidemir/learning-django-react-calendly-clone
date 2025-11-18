// IntegrationsSettings.jsx
import React, { useState } from 'react';
import Layout from '../../components/layout/Layout.jsx';
import GoogleCalendarConnect from '../../components/dashboard/GoogleCalendarConnect.jsx';
import '../../css/IntegrationsSettings.css';

const IntegrationsSettings = () => {
    // This state would normally be managed by a global context/redux 
    // and fetched from the backend (checking the Google_Token model)
    const [isConnected, setIsConnected] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleConnect = () => {
        setIsLoading(true);
        // Simulate API latency before redirect or success
        setTimeout(() => {
            setIsConnected(true); // Simulate successful OAuth callback
            setIsLoading(false);
            console.log("Connection state updated to TRUE.");
        }, 2000);
    };

    const handleDisconnect = () => {
        setIsLoading(true);
        // Simulate API latency for token revocation
        setTimeout(() => {
            setIsConnected(false);
            setIsLoading(false);
            console.log("Connection state updated to FALSE.");
        }, 1000);
    };

    return (
        <Layout useDashboardLayout={true} isLoggedIn={true}>
            <div className="settings-page-container">
                <h2> Integrations 🔗</h2>
                <p className="settings-description">Manage external services connected to your scheduling account.</p>
                
                <section className="integration-list">
                    <GoogleCalendarConnect 
                        isConnected={isConnected}
                        onConnect={handleConnect}
                        onDisconnect={handleDisconnect}
                        isLoading={isLoading}
                    />
                    
                    {/* Placeholder for future integrations */}
                    <div className="placeholder-integration">
                        <h3>Zoom/Other Conferencing</h3>
                        <p>Not yet integrated.</p>
                    </div>
                </section>
            </div>
        </Layout>
    );
};

export default IntegrationsSettings;