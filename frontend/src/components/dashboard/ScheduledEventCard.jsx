// ScheduledEventCard.jsx
import React from 'react';
import Button from '../core-ui/Button.jsx';
import '../../css/ScheduledEventCard.css'; // Correct relative import from components/dashboard

const formatTime = (isoString) => {
    return new Date(isoString).toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZoneName: 'short',
    });
};

const ScheduledEventCard = ({ booking }) => {
    const isUpcoming = booking.status === 'Upcoming';

    return (
        <div className={`scheduled-card ${booking.status.toLowerCase()}`}>
            <div className="card-details">
                <p className="card-event-name">{booking.eventName}</p>
                <h3 className="card-invitee-name">Meeting with {booking.invitee}</h3>
                
                <div className="card-meta">
                    <span className="meta-item">📅 {formatTime(booking.time)}</span>
                    <span className="meta-item">📍 {booking.type}</span>
                    <span className={`meta-status status-${booking.status.toLowerCase()}`}>{booking.status}</span>
                </div>
            </div>

            {isUpcoming && (
                <div className="card-actions">
                    <Button variant="secondary" size="small" onClick={() => console.log('Reschedule clicked')}>
                        Reschedule
                    </Button>
                    <Button variant="danger" size="small" onClick={() => console.log('Cancel clicked')}>
                        Cancel
                    </Button>
                </div>
            )}
        </div>
    );
};

export default ScheduledEventCard;