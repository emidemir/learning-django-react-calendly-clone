// AvailabilitySettings.jsx
import React, { useState } from 'react';
import Layout from '../../components/layout/Layout.jsx';
import Button from '../../components/core-ui/Button.jsx';
import AvailabilityRule from '../../components/dashboard/AvailabilityRule.jsx';
import InputField from '../../components/core-ui/InputField.jsx';
import Modal from '../../components/core-ui/Modal.jsx';
import '../../css/AvailabilitySettings.css';

// Mock Data for initial weekly schedule
const mockWeeklyRules = [
    { day: 'Monday', start: '09:00', end: '17:00', isAvailable: true },
    { day: 'Tuesday', start: '09:00', end: '17:00', isAvailable: true },
    { day: 'Wednesday', start: '09:00', end: '17:00', isAvailable: true },
    { day: 'Thursday', start: '09:00', end: '17:00', isAvailable: true },
    { day: 'Friday', start: '09:00', end: '17:00', isAvailable: true },
];

const AvailabilitySettings = () => {
    const [weeklyRules, setWeeklyRules] = useState(mockWeeklyRules);
    const [isSaving, setIsSaving] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    // Mock state for date overrides (e.g., vacation)
    const [dateOverrides, setDateOverrides] = useState([
        { id: 1, date: '2025-12-25', type: 'unavailable', note: 'Christmas Holiday' },
    ]);

    const handleWeeklyRulesChange = (newRules) => {
        setWeeklyRules(newRules);
    };

    const handleSaveWeeklyRules = () => {
        setIsSaving(true);
        console.log('Saving Weekly Rules:', weeklyRules);
        // Simulate API call to save rules
        setTimeout(() => {
            setIsSaving(false);
            alert('Weekly availability saved!');
        }, 1500);
    };

    const handleAddOverride = (overrideData) => {
        setDateOverrides([...dateOverrides, { ...overrideData, id: Date.now() }]);
        setIsModalOpen(false);
    };

    const handleDeleteOverride = (id) => {
        setDateOverrides(dateOverrides.filter(o => o.id !== id));
    };

    return (
        <Layout useDashboardLayout={true} isLoggedIn={true}>
            <div className="settings-page-container availability-container">
                <h2>Availability ⏱️</h2>
                
                <section className="settings-section">
                    <h3>General Weekly Hours</h3>
                    <p className="section-description">Set your default working hours for the week.</p>
                    <AvailabilityRule initialRules={weeklyRules} onChange={handleWeeklyRulesChange} />
                    <div className="save-button-container">
                        <Button 
                            variant="primary" 
                            onClick={handleSaveWeeklyRules} 
                            loading={isSaving}
                        >
                            {isSaving ? 'Saving...' : 'Save Weekly Availability'}
                        </Button>
                    </div>
                </section>

                <section className="settings-section">
                    <div className="section-header-row">
                        <h3>Date-Specific Overrides (Holidays, Time Off)</h3>
                        <Button variant="secondary" onClick={() => setIsModalOpen(true)}>
                            + Add Date Override
                        </Button>
                    </div>
                    
                    <div className="overrides-list">
                        {dateOverrides.length === 0 ? (
                            <p className="no-events-message">No date overrides currently set.</p>
                        ) : (
                            dateOverrides.map(override => (
                                <div key={override.id} className="override-item">
                                    <span>📅 {override.date}</span>
                                    <span className={`override-type ${override.type}`}>{override.type === 'unavailable' ? 'Unavailable' : 'Custom Hours'}</span>
                                    <span className="override-note">{override.note}</span>
                                    <Button 
                                        variant="danger" 
                                        size="small" 
                                        onClick={() => handleDeleteOverride(override.id)}
                                    >
                                        Delete
                                    </Button>
                                </div>
                            ))
                        )}
                    </div>
                </section>
            </div>
            
            <DateOverrideModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                onSave={handleAddOverride}
            />
        </Layout>
    );
};

// Simple Modal component for adding an override
const DateOverrideModal = ({ isOpen, onClose, onSave }) => {
    const [date, setDate] = useState('');
    const [note, setNote] = useState('');
    const [type, setType] = useState('unavailable'); // could also be 'custom'

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({ date, type, note });
        setDate('');
        setNote('');
        setType('unavailable');
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Add Date Override">
            <form onSubmit={handleSubmit}>
                <InputField 
                    label="Date"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                />
                <label className="input-label">Type</label>
                <select value={type} onChange={(e) => setType(e.target.value)} className="select-field">
                    <option value="unavailable">Mark as Unavailable</option>
                    <option value="custom">Set Custom Hours (Not Implemented)</option>
                </select>
                <InputField 
                    label="Note (Optional)"
                    type="text"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                />
                <div className="modal-footer-actions">
                    <Button variant="secondary" onClick={onClose} type="button">Cancel</Button>
                    <Button variant="primary" type="submit" disabled={!date}>Save Override</Button>
                </div>
            </form>
        </Modal>
    );
};

export default AvailabilitySettings;