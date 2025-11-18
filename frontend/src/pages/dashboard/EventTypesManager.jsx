// EventTypesManager.jsx
import React, { useState } from 'react';
import Layout from '../../components/layout/Layout.jsx';
import Button from '../../components/core-ui/Button.jsx';
import EventTypeListRow from '../../components/dashboard/EventTypeListRow.jsx'; // Will be created next
import { Link } from 'react-router-dom';
import '../../css/EventTypesManager.css';

// Mock Data
const mockEvents = [
  { id: 1, name: '30 Minute Meeting', duration: 30, isActive: true, slug: '30-min-meeting', link: 'host/30-min-meeting' },
  { id: 2, name: '1 Hour Consultation', duration: 60, isActive: true, slug: '1-hour-consult', link: 'host/1-hour-consult' },
  { id: 3, name: 'Quick 15-min Chat', duration: 15, isActive: false, slug: '15-min-chat', link: 'host/15-min-chat' },
];

const EventTypesManager = () => {
  const [events, setEvents] = useState(mockEvents);
  
  // Placeholder for future actions
  const handleToggle = (id) => {
    setEvents(events.map(e => 
      e.id === id ? { ...e, isActive: !e.isActive } : e
    ));
    console.log(`Toggled event ${id}`);
  };

  return (
    <Layout useDashboardLayout={true} isLoggedIn={true}>
      <div className="event-manager-header">
        <h2>Event Types</h2>
        <Link to="/event-types/create">
          <Button variant="primary">
            + New Event Type
          </Button>
        </Link>
      </div>
      
      <div className="event-list-container">
        {events.length === 0 ? (
          <p className="activity-placeholder">
            You haven't created any event types yet. Start scheduling!
          </p>
        ) : (
          <div className="event-list">
            {events.map(event => (
              <EventTypeListRow 
                key={event.id}
                event={event}
                onToggle={handleToggle}
              />
            ))}
          </div>
        )}
      </div>
      
    </Layout>
  );
};

export default EventTypesManager;