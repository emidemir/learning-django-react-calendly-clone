// BookingConfirmation.jsx
import React from 'react';
import { useSearchParams } from 'react-router-dom';
import Layout from '../../components/layout/Layout.jsx';
import Button from '../../components/core-ui/Button.jsx';
import '../../css/BookingConfirmation.css';

const BookingConfirmation = () => {
    const [searchParams] = useSearchParams();
    const bookingId = searchParams.get('bookingId');
    
    // In a real application, you would fetch confirmation details using bookingId
    const mockDetails = {
        eventName: "30 Minute Meeting",
        hostName: "John Doe",
        time: "Thursday, November 20 at 9:00 AM",
        location: "Zoom link sent via email",
    };

    return (
        <Layout isLoggedIn={false}>
            <div className="confirmation-container">
                <div className="confirmation-box">
                    <div className="confirmation-icon">🎉</div>
                    <h2>Confirmed!</h2>
                    <p className="confirmation-message">
                        You are scheduled with **{mockDetails.hostName}** for a **{mockDetails.eventName}**.
                    </p>
                    
                    <div className="confirmation-details">
                        <p><span>Time:</span> {mockDetails.time}</p>
                        <p><span>Location:</span> {mockDetails.location}</p>
                        <p>A confirmation email has been sent to your inbox.</p>
                    </div>

                    <div className="confirmation-actions">
                        <Button variant="secondary" onClick={() => window.location.href = '/'}>
                            Go Home
                        </Button>
                        <Button variant="primary" onClick={() => alert("Not implemented yet.")}>
                            Add to Calendar
                        </Button>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default BookingConfirmation;