// GoogleCalendarConnect.jsx
import React from 'react';
import Button from '../core-ui/Button.jsx';
import '../../css/GoogleCalendarConnect.css'; // Correct relative import from components/dashboard

const GoogleCalendarConnect = ({ isConnected, onConnect, onDisconnect, isLoading }) => {
    
    // Placeholder function to simulate starting the OAuth redirect
    const handleConnectClick = () => {
        if (!isConnected) {
            console.log("Initiating Google OAuth flow...");
            // In the backend integration phase, this will hit the Django endpoint:
            // window.location.href = '/api/integrations/google/connect/';
            onConnect(); 
        }
    };
    
    // Placeholder function for disconnection
    const handleDisconnectClick = () => {
        if (isConnected) {
            console.log("Disconnecting Google Calendar...");
            // In the backend integration phase, this will hit the Django endpoint:
            // fetch('/api/integrations/google/disconnect/')
            onDisconnect(); 
        }
    };

    return (
        <div className="google-connect-card">
            <div className="card-header-status">
                <img 
                    src="https://upload.wikimedia.org/wikipedia/commons/a/a5/Google_Calendar_icon.svg" 
                    alt="Google Calendar" 
                    className="google-icon"
                />
                <h3>Google Calendar</h3>
                <span className={`connection-status status-${isConnected ? 'connected' : 'disconnected'}`}>
                    {isConnected ? 'Connected' : 'Not Connected'}
                </span>
            </div>

            <p className="card-description">
                Connect your Google Calendar to automatically check your availability and add new bookings to your calendar.
            </p>

            <div className="card-actions">
                {isConnected ? (
                    <Button 
                        variant="secondary" 
                        size="medium" 
                        onClick={handleDisconnectClick}
                        loading={isLoading}
                    >
                        Disconnect Calendar
                    </Button>
                ) : (
                    <Button 
                        variant="primary" 
                        size="medium" 
                        onClick={handleConnectClick}
                        loading={isLoading}
                    >
                        {isLoading ? 'Connecting...' : 'Connect Google Calendar'}
                    </Button>
                )}
            </div>
        </div>
    );
};

export default GoogleCalendarConnect;