// TimeSelection.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../../components/layout/Layout.jsx';
import CalendarView from '../../components/scheduling/CalendarView.jsx';
import TimeSlotGrid from '../../components/scheduling/TimeSlotGrid.jsx';
import Button from '../../components/core-ui/Button.jsx';
import TimeZoneSelector from '../../components/scheduling/TimeZoneSelector.jsx'; // To be created next
import '../../css/TimeSelection.css';

// Mock Data
const mockEventData = {
    name: '30 Minute Meeting',
    duration: 30,
    locationType: 'Zoom',
    description: 'A quick catch-up or demo call.',
    hostName: 'John Doe',
};

// Mock available dates (ISO format: YYYY-MM-DD)
const mockAvailableDates = ['2025-11-20', '2025-11-21', '2025-11-24', '2025-11-25', '2025-12-01'];

const TimeSelection = () => {
    const { username, eventSlug } = useParams();
    const navigate = useNavigate();
    const [event, setEvent] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedTime, setSelectedTime] = useState(null);
    const [timeZone, setTimeZone] = useState(Intl.DateTimeFormat().resolvedOptions().timeZone);

    useEffect(() => {
        // Simulate API call to fetch event details based on slug
        console.log(`Fetching details for ${username}/${eventSlug}`);
        setTimeout(() => {
            setEvent(mockEventData);
        }, 500);
    }, [username, eventSlug]);

    const handleDateSelect = (date) => {
        setSelectedDate(date);
        setSelectedTime(null); // Reset time selection when date changes
    };

    const handleSlotSelect = (time) => {
        setSelectedTime(time);
    };

    const handleNext = () => {
        if (selectedDate && selectedTime) {
            // Encode the selected time and date in the URL for the booking form
            const dateTime = `${selectedDate}T${selectedTime}`; 
            navigate(`/${username}/${eventSlug}/details?datetime=${dateTime}&tz=${timeZone}`);
        }
    };

    if (!event) {
        return <Layout><div className="loading-state">Loading Event...</div></Layout>;
    }

    return (
        <Layout isLoggedIn={false}>
            <div className="time-selection-page">
                <div className="event-details-panel">
                    <p className="host-name-small">{event.hostName}</p>
                    <h2 className="event-name-large">{event.name}</h2>
                    <div className="event-info-list">
                        <p><span>⏰</span> {event.duration} min</p>
                        <p><span>📍</span> {event.locationType}</p>
                        <p><span>📝</span> {event.description}</p>
                    </div>
                </div>

                <div className="scheduling-panel">
                    <div className="date-selection-area">
                        <CalendarView 
                            onDateSelect={handleDateSelect} 
                            availableDates={mockAvailableDates}
                        />
                        <TimeZoneSelector 
                            currentTimeZone={timeZone} 
                            onTimeZoneChange={setTimeZone}
                        />
                    </div>
                    
                    <div className="time-selection-area">
                        <TimeSlotGrid
                            selectedDate={selectedDate}
                            selectedTime={selectedTime}
                            onSlotSelect={handleSlotSelect}
                        />
                        
                        <div className="next-button-container">
                            <Button 
                                variant="primary" 
                                size="large"
                                onClick={handleNext}
                                disabled={!selectedTime}
                            >
                                Next
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default TimeSelection;