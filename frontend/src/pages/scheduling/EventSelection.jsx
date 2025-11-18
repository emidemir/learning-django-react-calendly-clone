// EventSelection.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import EventCard from '../../components/scheduling/EventCard.jsx';
import Layout from '../../components/layout/Layout.jsx';
import '../../css/EventSelection.css'; // Correct relative import from pages/scheduling

// Mock Data
const mockHostData = {
    username: 'john-doe',
    fullName: 'John Doe',
    tagline: 'Software Developer & Technical Consultant',
    profilePicture: 'https://via.placeholder.com/150',
    eventTypes: [
        { id: 1, name: '30 Minute Meeting', duration: 30, slug: '30-min-meeting', description: 'Quick meeting for Q&A or demo.' },
        { id: 2, name: '1 Hour Consultation', duration: 60, slug: '1-hour-consult', description: 'In-depth review or strategy session.' },
    ]
};

const EventSelection = () => {
    const { username } = useParams(); // Get the host's username from the URL
    const [host, setHost] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Simulate API call to fetch host profile and active event types
        console.log(`Fetching events for host: ${username}`);
        setTimeout(() => {
            setHost(mockHostData);
            setIsLoading(false);
        }, 800);
    }, [username]);

    if (isLoading) {
        return <Layout><div className="loading-state">Loading Host Profile...</div></Layout>;
    }
    
    if (!host) {
        return <Layout><div className="error-state">Host profile not found.</div></Layout>;
    }

    return (
        <Layout isLoggedIn={false}>
            <div className="event-selection-page">
                <header className="host-header">
                    <img src={host.profilePicture} alt={`${host.fullName}'s profile`} className="host-avatar" />
                    <h1 className="host-name">{host.fullName}</h1>
                    <p className="host-tagline">{host.tagline}</p>
                </header>
                
                <section className="event-list-section">
                    <h2 className="section-title">Select an Event Type</h2>
                    <div className="event-list-grid">
                        {host.eventTypes.map(event => (
                            <EventCard key={event.id} event={event} hostUsername={host.username} />
                        ))}
                    </div>
                </section>
            </div>
        </Layout>
    );
};

export default EventSelection;