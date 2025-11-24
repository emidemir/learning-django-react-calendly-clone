// BookingForm.jsx
import React, { useState } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import Layout from '../../components/layout/Layout.jsx';
import InputField from '../../components/core-ui/InputField.jsx';
import Button from '../../components/core-ui/Button.jsx';
import '../../css/BookingForm.css';

const BookingForm = () => {
    const { username, eventSlug} = useParams();
    const [searchParams] = useSearchParams();

    const navigate = useNavigate();
    
    // Parse URL params for pre-selected time
    const dateTimeParam = searchParams.get('datetime');
    const timeZoneParam = searchParams.get('tz');
    const title = searchParams.get('title')
    const duration = searchParams.get('duration')
    
    const [formData, setFormData] = useState({ booker_name: '', booker_email: '', notes: '' });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        const bookingData = {
            ...formData,
            host_name: username,
            event_slug: eventSlug,
            event_title: title,
            event_date_time: dateTimeParam,
            time_zone: timeZoneParam,
        };

        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/${username}/${eventSlug}/details?datetime=${dateTimeParam}&tz=${timeZoneParam}&title=${title}&duration=${duration}`,{
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(bookingData)
        });

        if (response.ok){
            alert("Booking created succesfully!");
            navigate('/');
        }else{
            alert("Something happened while booking creation");
        }
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
                    <p className="summary-host">{username}</p>
                    <h2 className="summary-event">{title}</h2>
                    <div className="summary-info">
                        <p><span>⏰</span> {duration} min</p>
                        <p><span>📅</span> {formattedDateTime}</p>
                    </div>
                </div>

                <div className="booking-form-panel">
                    <h3 className="form-title">Enter Your Details</h3>
                    <form onSubmit={handleSubmit}>
                        <InputField
                            label="Your Name"
                            name="booker_name"
                            value={formData.booker_name}
                            onChange={handleChange}
                            required
                        />
                        <InputField
                            label="Email Address"
                            name="booker_email"
                            type="email"
                            value={formData.booker_email}
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
                            disabled={isLoading || !formData.booker_name || !formData.booker_email}
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