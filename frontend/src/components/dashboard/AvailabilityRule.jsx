// AvailabilityRule.jsx
import React, { useState, useEffect } from 'react';
import Button from '../core-ui/Button.jsx';
import '../../css/AvailabilityRule.css'; // Correct relative import

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const AvailabilityRule = ({ initialRules, onChange }) => {
    // Local state for managing the rules array
    const [rules, setRules] = useState([]);

    // Initialize state from props
    useEffect(() => {
        // Populate with all days, setting defaults or existing rules
        const fullRules = daysOfWeek.map(day => {
            const existing = initialRules.find(r => r.day === day);
            return existing || { day, start: '09:00', end: '17:00', isAvailable: !!existing };
        });
        setRules(fullRules);
    }, [initialRules]);
    
    // Notify parent component of changes
    useEffect(() => {
        // Filter out unavailable days before sending to parent/API
        const availableRules = rules.filter(r => r.isAvailable);
        onChange(availableRules);
    }, [rules, onChange]); 

    const handleRuleChange = (day, field, value) => {
        setRules(prevRules => 
            prevRules.map(rule => 
                rule.day === day ? { ...rule, [field]: value } : rule
            )
        );
    };

    const handleToggleAvailability = (day) => {
        setRules(prevRules => 
            prevRules.map(rule => 
                rule.day === day ? { ...rule, isAvailable: !rule.isAvailable } : rule
            )
        );
    };

    return (
        <div className="availability-rules-editor">
            {rules.map(rule => (
                <div key={rule.day} className="rule-row">
                    <div className="rule-toggle">
                        <input
                            type="checkbox"
                            id={`toggle-${rule.day}`}
                            checked={rule.isAvailable}
                            onChange={() => handleToggleAvailability(rule.day)}
                        />
                        <label htmlFor={`toggle-${rule.day}`}>{rule.day}</label>
                    </div>

                    <div className="rule-time-inputs">
                        {rule.isAvailable ? (
                            <>
                                <input
                                    type="time"
                                    value={rule.start}
                                    onChange={(e) => handleRuleChange(rule.day, 'start', e.target.value)}
                                    className="time-input"
                                />
                                <span className="time-separator">to</span>
                                <input
                                    type="time"
                                    value={rule.end}
                                    onChange={(e) => handleRuleChange(rule.day, 'end', e.target.value)}
                                    className="time-input"
                                />
                            </>
                        ) : (
                            <span className="unavailable-text">Unavailable</span>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default AvailabilityRule;