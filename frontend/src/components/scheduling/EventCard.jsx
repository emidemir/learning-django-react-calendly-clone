// EventCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../core-ui/Button.jsx';
import '../../css/EventCard.css'; // Correct relative import from components/scheduling

const EventCard = ({ event, hostUsername }) => {
  const linkToSchedule = `/${hostUsername}/${event.slug}`;
  
  return (
    <div className="event-card">
      <div className="event-card-header">
        <h3 className="event-card-name">{event.name}</h3>
        <p className="event-card-duration">⏰ {event.duration} min</p>
      </div>
      <p className="event-card-description">{event.description}</p>
      
      <div className="event-card-footer">
        <Link to={linkToSchedule}>
          <Button variant="secondary" size="small">
            Schedule
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default EventCard;