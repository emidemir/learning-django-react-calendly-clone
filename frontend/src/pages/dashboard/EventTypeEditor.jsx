// EventTypeEditor.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../../components/layout/Layout.jsx';
import InputField from '../../components/core-ui/InputField.jsx';
import Button from '../../components/core-ui/Button.jsx';
import AvailabilityRule from '../../components/dashboard/AvailabilityRule.jsx'; // To be created next
import '../../css/EventTypeEditor.css';

// Mock Data (to simulate fetching an existing event)
const mockEventDetail = {
    id: 1,
    name: '30 Minute Meeting',
    slug: '30-min-meeting',
    duration: 30, // in minutes
    description: 'A quick catch-up or demo call.',
    locationType: 'Zoom',
    bufferBefore: 5,
    bufferAfter: 5,
    availability: [
        { day: 'Monday', start: '09:00', end: '17:00' },
        { day: 'Tuesday', start: '09:00', end: '17:00' },
        // ... more days
    ]
};

const EventTypeEditor = () => {
    const { id } = useParams(); // Check if we're editing an existing event
    const navigate = useNavigate();
    const isEditing = !!id;
    const [isLoading, setIsLoading] = useState(false);
    
    // Initial state setup
    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        duration: 30,
        description: '',
        locationType: 'Zoom',
        bufferBefore: 0,
        bufferAfter: 0,
        availability: []
    });

    useEffect(() => {
        if (isEditing) {
            setIsLoading(true);
            // Simulate API call to fetch event details
            setTimeout(() => {
                setFormData(mockEventDetail);
                setIsLoading(false);
            }, 500);
        }
    }, [isEditing, id]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleDurationChange = (e) => {
        // Ensure duration is a positive number
        const value = parseInt(e.target.value) || 0;
        setFormData({ ...formData, duration: Math.max(value, 1) });
    };

    const handleAvailabilityChange = (newRules) => {
        setFormData({ ...formData, availability: newRules });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsLoading(true);

        // Placeholder for API call: POST for create, PUT/PATCH for update
        console.log(isEditing ? 'Updating Event:' : 'Creating Event:', formData);

        setTimeout(() => {
            setIsLoading(false);
            alert(`Event ${isEditing ? 'Updated' : 'Created'} Successfully!`);
            navigate('/event-types'); // Redirect back to list
        }, 1500);
    };

    if (isLoading && isEditing) {
        return <Layout useDashboardLayout={true} isLoggedIn={true}>Loading Event Details...</Layout>;
    }

    return (
        <Layout useDashboardLayout={true} isLoggedIn={true}>
            <div className="editor-container">
                <h2>{isEditing ? 'Edit Event Type' : 'Create New Event Type'}</h2>
                <form onSubmit={handleSubmit} className="event-editor-form">
                    
                    <div className="editor-section">
                        <h3>Event Details</h3>
                        <InputField
                            label="Event Name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="e.g., 30 Minute Meeting"
                            required
                        />
                        <InputField
                            label="URL Slug (Public Link)"
                            name="slug"
                            value={formData.slug}
                            onChange={handleChange}
                            placeholder="e.g., quick-chat"
                            required
                        />
                        <div className="form-row">
                            <InputField
                                label="Duration (minutes)"
                                name="duration"
                                type="number"
                                value={formData.duration}
                                onChange={handleDurationChange}
                                required
                            />
                            <InputField
                                label="Location/Method"
                                name="locationType"
                                value={formData.locationType}
                                onChange={handleChange}
                                placeholder="e.g., Zoom, Google Meet"
                            />
                        </div>
                        <label htmlFor="description" className="input-label">Description</label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Optional short description for your invitees."
                            className="textarea-field"
                        />
                    </div>
                    
                    <div className="editor-section">
                        <h3>Advanced Scheduling Rules</h3>
                        <div className="form-row">
                            <InputField
                                label="Buffer Before (min)"
                                name="bufferBefore"
                                type="number"
                                value={formData.bufferBefore}
                                onChange={handleChange}
                            />
                            <InputField
                                label="Buffer After (min)"
                                name="bufferAfter"
                                type="number"
                                value={formData.bufferAfter}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                    
                    <div className="editor-section">
                        <h3>Availability</h3>
                        <p className="section-description">Define the recurring weekly hours for this event type.</p>
                        {/* The AvailabilityRule component will handle the complex array state */}
                        <AvailabilityRule 
                            initialRules={formData.availability} 
                            onChange={handleAvailabilityChange}
                        />
                    </div>

                    <div className="editor-footer">
                        <Button variant="secondary" onClick={() => navigate('/event-types')}>
                            Cancel
                        </Button>
                        <Button 
                            type="submit" 
                            variant="primary" 
                            size="large" 
                            loading={isLoading}
                        >
                            {isEditing ? 'Save Changes' : 'Create Event'}
                        </Button>
                    </div>

                </form>
            </div>
        </Layout>
    );
};

export default EventTypeEditor;