// EventTypesManager.jsx
import Layout from '../../components/layout/Layout.jsx';
import React, { useEffect, useState } from 'react';
import Button from '../../components/core-ui/Button.jsx';
import EventTypeListRow from '../../components/dashboard/EventTypeListRow.jsx';
import { Link } from 'react-router-dom';
import '../../css/EventTypesManager.css';

const EventTypesManager = () => {
	const authToken = localStorage.getItem("access_token");
  	const [events, setEvents] = useState([]); // ← Changed from [{}] to []
  
	useEffect(() => {
		const getEventTypes = async () => {
			const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/event_types/`, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					"Authorization": `Bearer ${authToken}`,
				}
			});
			const data = await response.json();

			if (response.ok) {
				console.log(data);
				setEvents(data)
			} else {
				alert("Something went wrong when fetching event types: " + JSON.stringify(data));
			}
		};

		getEventTypes();
	}, [authToken]) // ← Also added authToken to dependency array

	const handleToggle = async (id) => {
		
		const eventToUpdate = events.find(event => event.id === id);

		if (!eventToUpdate) {
            alert(`Event with id ${id} not found.`);
            return;
        }

		const newIsActive = !eventToUpdate.is_active;

		const payload = {
            ...eventToUpdate,
            is_active: newIsActive
        };

		const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/event_types/${id}/`,{
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
				"Authorization": `Bearer ${authToken}`,
			},
			body: JSON.stringify(payload)
		});

		if (response.ok){
            setEvents(events.map(e => 
                e.id === id ? { ...e, is_active: newIsActive } : e
            ));
        } else {
            const errorData = await response.json().catch(() => response.statusText);
            alert("Something went wrong while adjusting event status: " + JSON.stringify(errorData));
        }
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