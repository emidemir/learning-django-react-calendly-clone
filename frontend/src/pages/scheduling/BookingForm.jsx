// BookingForm.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import Layout from '../../components/layout/Layout.jsx';
import InputField from '../../components/core-ui/InputField.jsx';
import Button from '../../components/core-ui/Button.jsx';
import '../../css/BookingForm.css';

// Mock Data
const mockBookingDetails = {
    hostName: 'John Doe',
    eventName: '30 Minute Meeting',
    duration: 30,
    locationType: 'Zoom',
};

const BookingForm = () => {
    const { username, eventSlug } = useParams();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    
    // Parse URL params for pre-selected time
    const dateTimeParam = searchParams.get('datetime');
    const timeZoneParam = searchParams.get('tz');
    
    const [bookingDetails, setBookingDetails] = useState(mockBookingDetails);
    const [formData, setFormData] = useState({ name: '', email: '', notes: '' });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Fetch event details (optional, already mocked)
        if (!dateTimeParam || !timeZoneParam) {
            setError("Missing date or time zone information. Please go back and select a time.");
        }
    }, [dateTimeParam, timeZoneParam]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        const bookingData = {
            ...formData,
            host: username,
            eventSlug: eventSlug,
            startTime: dateTimeParam,
            timeZone: timeZoneParam,
        };

        // Placeholder for API call: POST to /api/booking/
        console.log('Final Booking Submission:', bookingData);

        setTimeout(() => {
            setIsLoading(false);
            if (Math.random() > 0.1) { // 90% success rate simulation
                console.log("Booking successful!");
                // Redirect to success page
                navigate(`/success?bookingId=123`); 
            } else {
                setError("Booking failed. Please try a different time or contact the host.");
            }
        }, 2000);
    };

    // Format the selected date and time for display
    let formattedDateTime = 'N/A';
    if (dateTimeParam) {
        try {
            // Converts ISO string to readable date/time (e.g., Thu, Nov 20, 9:00 AM)
            const date = new Date(dateTimeParam);
            formattedDateTime = date.toLocaleTimeString('en-US', { 
                weekday: 'short', 
                month: 'short', 
                day: 'numeric', 
                hour: '2-digit', 
                minute: '2-digit' 
            });
        } catch (e) {
            formattedDateTime = 'Invalid Date/Time';
        }
    }

    if (error && error.includes("Missing")) {
        return <Layout isLoggedIn={false}><div className="error-state">{error}</div></Layout>;
    }

    return (
        <Layout isLoggedIn={false}>
            <div className="booking-form-page">
                <div className="booking-summary-panel">
                    <p className="summary-host">{bookingDetails.hostName}</p>
                    <h2 className="summary-event">{bookingDetails.eventName}</h2>
                    <div className="summary-info">
                        <p><span>⏰</span> {bookingDetails.duration} min</p>
                        <p><span>📅</span> {formattedDateTime}</p>
                        <p><span>🌐</span> {timeZoneParam}</p>
                        <p><span>📍</span> {bookingDetails.locationType}</p>
                    </div>
                </div>

                <div className="booking-form-panel">
                    <h3 className="form-title">Enter Your Details</h3>
                    <form onSubmit={handleSubmit}>
                        <InputField
                            label="Your Name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                        <InputField
                            label="Email Address"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                         <label htmlFor="notes" className="input-label">Additional Notes (Optional)</label>
                         <textarea
                            id="notes"
                            name="notes"
                            value={formData.notes}
                            onChange={handleChange}
                            placeholder="Any details the host should know before the meeting."
                            className="textarea-field"
                        />
                        
                        {error && <p className="submission-error-message">{error}</p>}

                        <Button 
                            type="submit" 
                            variant="primary" 
                            size="large" 
                            loading={isLoading}
                            disabled={isLoading || !formData.name || !formData.email}
                        >
                            {isLoading ? 'Confirming...' : 'Confirm Booking'}
                        </Button>
                    </form>
                </div>
            </div>
        </Layout>
    );
};

export default BookingForm;