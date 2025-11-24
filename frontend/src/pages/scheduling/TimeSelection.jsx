// TimeSelection.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../../components/layout/Layout.jsx';
import CalendarView from '../../components/scheduling/CalendarView.jsx';
import TimeSlotGrid from '../../components/scheduling/TimeSlotGrid.jsx';
import Button from '../../components/core-ui/Button.jsx';
import TimeZoneSelector from '../../components/scheduling/TimeZoneSelector.jsx'; 
import '../../css/TimeSelection.css';

const TimeSelection = () => {
    const { username, eventSlug } = useParams();
    const navigate = useNavigate();

    const [eventData, setEventData] = useState(null);
    // Initialize with empty array to avoid null checks in CalendarView
    const [availableDays, setAvailableDates] = useState([]); 
    
    // User selected fields
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedTime, setSelectedTime] = useState(null);
    const [timeZone, setTimeZone] = useState(Intl.DateTimeFormat().resolvedOptions().timeZone);

    // 1. NEW STATE: Needed to store the specific time slots for the selected date
    const [availableSlotsForDay, setAvailableSlotsForDay] = useState([]);

    const generateTimeSlots = (startTimeStr, endTimeStr, durationMinutes) => {
        const slots = [];
        const [startH, startM] = startTimeStr.split(':').map(Number);
        const [endH, endM] = endTimeStr.split(':').map(Number);

        let current = new Date();
        current.setHours(startH, startM, 0, 0);

        const end = new Date();
        end.setHours(endH, endM, 0, 0);

        while (current < end) {
            // Format to HH:MM
            const timeString = current.toLocaleTimeString('en-US', {
                hour12: false, 
                hour: '2-digit', 
                minute: '2-digit'
            });
            slots.push(timeString);
            
            // Add duration
            current.setMinutes(current.getMinutes() + durationMinutes);
        }
        return slots;
    };

    useEffect(()=>{ 
        const fetchEventData = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/booking/${username}/${eventSlug}/`,{
                    method: "GET",
                    headers:{
                        "Content-Type": "application/json",
                    }
                });

                const data = await response.json();
                if(response.ok){
                    setEventData(data);
                    // Safely handle if availability_rules is missing
                    if (data.availability_rules) {
                        // 1. Filter: Keep only rules where isAvailable is true
                        const activeRules = data.availability_rules.filter(rule => rule.isAvailable === true);
                        
                        // 2. Map: Get the days from those active rules
                        const dates = activeRules.map(rule => rule.day);
                        console.log(dates)
                        
                        // 3. Unique: Remove duplicates so the calendar knows which days are clickable
                        const uniqueDates = [...new Set(dates)];
                        
                        setAvailableDates(uniqueDates);
                    }
                } else {
                    console.log("Data fetch error:", data);
                    alert("Data fetch failed in Time Selection!");
                }
            } catch (error) {
                console.error("Fetch error:", error);
            }
        }

        fetchEventData();
    }, [username, eventSlug]);
    
    const handleDateSelect = (dateString) => {
        setSelectedDate(dateString);
        setSelectedTime(null); // Reset time selection
        
        const rulesForDay = eventData.availability_rules.filter(r => 
            r.day === dateString && r.isAvailable === true
        );

        if (rulesForDay.length > 0) {
            const slots = rulesForDay.map(rule => {
                // rule.start_time comes as "14:30:00", we usually want "14:30"
                return rule.start_time.slice(0, 5); 
            });
            
            // Optional: Sort them just to be safe
            slots.sort();

            setAvailableSlotsForDay(slots);
        } else {
            setAvailableSlotsForDay([]);
        }
    };

    const handleSlotSelect = (time) => {
        setSelectedTime(time);
    };

    const handleNext = () => {
        if (selectedDate && selectedTime) {
            const dateTime = `${selectedDate}T${selectedTime}`; 
            navigate(`/${username}/${eventSlug}/details?datetime=${dateTime}&tz=${timeZone}&title=${eventData.title}&duration=${eventData.duration}`);
        }
    };

    if (!eventData) {
        return (
            <Layout isLoggedIn={false}>
                <div style={{ padding: "50px", textAlign: "center" }}>
                    Loading event details...
                </div>
            </Layout>
        );
    }

    return (
        <Layout isLoggedIn={false}>
            <div className="time-selection-page">
                <div className="event-details-panel">
                    <p className="host-name-small">{username}</p>
                    <h2 className="event-name-large">{eventData.title}</h2>
                    <div className="event-info-list">
                        <p><span>⏰</span> {eventData.duration} min</p>
                        <p><span>📝</span> {eventData.description}</p>
                    </div>
                </div>

                <div className="scheduling-panel">
                    <div className="date-selection-area">
                        <CalendarView 
                            onDateSelect={handleDateSelect} 
                            availableDates={availableDays}
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
                            availableSlots={availableSlotsForDay} // <--- Passed the new state here
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