// EventTypeEditor.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../../components/layout/Layout.jsx';
import InputField from '../../components/core-ui/InputField.jsx';
import Button from '../../components/core-ui/Button.jsx';
import AvailabilityRule from '../../components/dashboard/AvailabilityRule.jsx'; // To be created next
import '../../css/EventTypeEditor.css';

const EventTypeEditor = () => {
    const { eventID } = useParams();
    const navigate = useNavigate();

    const authToken = localStorage.getItem("access_token");
 
    const isEditing = Boolean(eventID);
    const [isLoading, setIsLoading] = useState(false);
    
    // Initial state setup
    const [formData, setFormData] = useState({
        title: '',
        duration: 0,
        description: '',
        bufferBefore: 0,
        bufferAfter: 0,
        availability: [],
        bufferBefore: 0,
        bufferAfter: 0,
        isActive: false,
        newly_created_availability_rules: []
    });

    // Fetch event_type data
    useEffect(() => {
        const fetchEventDetails = async () => {
            setIsLoading(true);
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/event_types/${eventID}/`,{
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${authToken}`,
                }
            });
            const data = await response.json();
            if (response.ok){
                setFormData({
                    id: data.id,
                    title: data.title,
                    description: data.description,
                    duration: data.duration,
                    availability: data.availability_rules,
                    isActive: data.is_active,
                    bufferBefore: data.bufferBefore,
                    bufferAfter: data.bufferAfter,
                    newly_created_availability_rules: data.availability_rules,
                })
            }else{
                alert("Something went wrong while fetching event details." + JSON.stringify(data));
            }
            setIsLoading(false);
        }
        if (isEditing) {
            fetchEventDetails();
        }
    }, [authToken, eventID]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleDurationChange = (e) => {
        const rawValue = e.target.value;
    
        if (rawValue === "" || rawValue === "-") {
            // ALLOW empty string or just a negative sign temporarily.
            // This lets the user delete the number completely.
            setFormData({ ...formData, duration: rawValue });
        } else {
            // Ensure the value is a positive integer before saving it to state.
            const numericValue = parseInt(rawValue, 10);
            
            // Only update state if it's a valid number.
            if (!isNaN(numericValue)) {
                // Apply Math.max(1, value) to ensure it's at least 1, but don't use Math.max
                // on the raw string, or you'll run into the original NaN issue.
                setFormData({ ...formData, duration: numericValue });
            }
        }
    };

    const handleAvailabilityChange = useCallback((newRules) => {
        setFormData(prev => ({ ...prev, newly_created_availability_rules: newRules }));
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        const payload = {
            ...formData
        };

        // If editing, fetch PUT. If not, fetch POST
        if(isEditing){
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/event_types/${eventID}/`,{
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${authToken}`,
                },
                body: JSON.stringify(payload)
            })

            const data = await response.json();

            if (response.ok){
                alert("Event succesfully edited.");
                setFormData(prev => ({
                    ...prev,
                    availability: data.availability_rules,
                    newly_created_availability_rules: data.availability_rules
                }));
            }else{
                alert("Something went wrong while editing: " + JSON.stringify(data))
            }

        }else{
            console.log("Hello??")
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/event_types/`,{
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${authToken}`,
                },
                body: JSON.stringify(payload)
            });

            const data = await response.json();

            if (response.ok){
                alert("Event succesfully created!");
                navigate('/dashboard')
            }else{
                alert("Something went wrong while creating event: " + JSON.stringify(data));
            }
        }
        setIsLoading(false);
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
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="e.g., 30 Minute Meeting"
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