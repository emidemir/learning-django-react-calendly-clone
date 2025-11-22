// EventCard.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../core-ui/Button.jsx';
import '../../css/EventCard.css';

const EventCard = ({ event, hostUsername }) => {
	const navigate = useNavigate()

	const handleClickSchedule = () => {
		const urlParts = event.booking_url.split('/'); 
        const extractedSlug = urlParts[2];

		// Pass the eevent with the navigate to the public booking form, or page. Whatever
		navigate(`/${hostUsername}/${extractedSlug}`);
	}

	return (
		<div className="event-card">
		<div className="event-card-header">
			<h3 className="event-card-name">{event.title}</h3>
			<p className="event-card-duration">⏰ {event.duration} min</p>
		</div>
		<p className="event-card-description">{event.description}</p>
		
		<div className="event-card-footer">
			<Button variant="secondary" size="small" onClick={handleClickSchedule}>
				Schedule
			</Button>
		</div>
		</div>
	);
};

export default EventCard;