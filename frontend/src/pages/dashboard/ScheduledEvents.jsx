// ScheduledEvents.jsx
import React, { useState } from 'react';
import Layout from '../../components/layout/Layout.jsx';
import ScheduledEventCard from '../../components/dashboard/ScheduledEventCard.jsx'; // Will be created next
import '../../css/ScheduledEvents.css';

// Mock Data
const mockBookings = [
    { id: 101, eventName: '30 Minute Meeting', invitee: 'Alice Johnson', time: '2025-12-05T10:30:00', status: 'Upcoming', type: 'Zoom' },
    { id: 102, eventName: '1 Hour Consultation', invitee: 'Bob Williams', time: '2025-11-20T14:00:00', status: 'Completed', type: 'In-Person' },
    { id: 103, eventName: 'Quick 15-min Chat', invitee: 'Charlie Day', time: '2025-12-15T09:00:00', status: 'Canceled', type: 'Phone' },
];

const ScheduledEvents = () => {
    const [bookings, setBookings] = useState(mockBookings);
    const [filter, setFilter] = useState('upcoming'); // upcoming, past, canceled

    // Logic to filter the mock data
    const filteredBookings = bookings.filter(booking => {
        const now = new Date();
        const bookingTime = new Date(booking.time);
        
        if (filter === 'upcoming') {
            return booking.status === 'Upcoming' && bookingTime > now;
        }
        if (filter === 'past') {
            return booking.status === 'Completed' || bookingTime <= now;
        }
        return booking.status.toLowerCase() === filter;
    });

    return (
        <Layout useDashboardLayout={true} isLoggedIn={true}>
            <div className="scheduled-events-manager">
                <h2>Scheduled Events</h2>

                <div className="event-filter-tabs">
                    <button 
                        className={`filter-tab ${filter === 'upcoming' ? 'active' : ''}`}
                        onClick={() => setFilter('upcoming')}
                    >
                        Upcoming
                    </button>
                    <button 
                        className={`filter-tab ${filter === 'past' ? 'active' : ''}`}
                        onClick={() => setFilter('past')}
                    >
                        Past
                    </button>
                    <button 
                        className={`filter-tab ${filter === 'canceled' ? 'active' : ''}`}
                        onClick={() => setFilter('canceled')}
                    >
                        Canceled
                    </button>
                </div>

                <div className="event-list-view">
                    {filteredBookings.length === 0 ? (
                        <p className="no-events-message">No {filter} events found.</p>
                    ) : (
                        filteredBookings.map(booking => (
                            <ScheduledEventCard key={booking.id} booking={booking} />
                        ))
                    )}
                </div>
            </div>
        </Layout>
    );
};

export default ScheduledEvents;