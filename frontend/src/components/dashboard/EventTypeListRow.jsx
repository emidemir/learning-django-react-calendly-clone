// EventTypeListRow.jsx
import React from 'react';
import Button from '../core-ui/Button.jsx';
import { Link } from 'react-router-dom';
import '../../css/EventTypeListRow.css'; // Correct relative import from components/dashboard

const EventTypeListRow = ({ event, onToggle }) => {
  const publicLink = `${window.location.origin}/${event.link}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(publicLink);
    alert(`Link copied: ${publicLink}`);
  };

  return (
    <div className={`event-list-row ${event.is_active ? '' : 'event-list-row--inactive'}`}>
      <div className="event-info">
        <span className="event-status-indicator" title={event.is_active ? 'Active' : 'Inactive'}></span>
        <h3>{event.title}</h3>
        <p className="event-duration">{event.duration} min</p>
      </div>

      <div className="event-actions">
        <Button variant="secondary" size="small" onClick={handleCopy}>
          Copy Link
        </Button>
        <Link to={`/event-types/${event.id}/edit`}>
          <Button variant="secondary" size="small">
            Edit
          </Button>
        </Link>
        <Button 
          variant={event.isActive ? "secondary" : "primary"} 
          size="small" 
          onClick={() => onToggle(event.id)}
        >
          {event.isActive ? 'Deactivate' : 'Activate'}
        </Button>
        {/* Delete functionality would use a Modal for confirmation */}
      </div>
    </div>
  );
};

export default EventTypeListRow;