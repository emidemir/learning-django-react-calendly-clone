// AvailabilityRule.jsx
import React, { useState, useEffect, useRef } from 'react';
// import Button from '../core-ui/Button.jsx';
import '../../css/AvailabilityRule.css';

const daysOfWeek = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];

const AvailabilityRule = ({ initialRules, onChange }) => {
    const [rules, setRules] = useState([]);
    const isInitialized = useRef(false);

    // Initialize existing rules
    useEffect(() => {
        if (!isInitialized.current) {
            const fullRules = daysOfWeek.map(day_of_week => {
                const existing = initialRules?.find(r => r.day_of_week === day_of_week);
                return existing || { day_of_week, start_time: '09:00', end_time: '17:00', isAvailable: !!existing };
            });
            setRules(fullRules);
            isInitialized.current = true;
        }
    }, []);
    
    // Notify parent component of changes (but not on initial render)
    useEffect(() => {
        if (isInitialized.current && rules.length > 0) {
            const availableRules = rules.filter(r => r.isAvailable);
            onChange(availableRules);
        }
    }, [rules]); // Remove onChange from dependencies

    const handleRuleChange = (day_of_week, field, value) => {
        setRules(prevRules => 
            prevRules.map(rule => 
                rule.day_of_week === day_of_week ? { ...rule, [field]: value } : rule
            )
        );
    };

    const handleToggleAvailability = (day_of_week) => {
        setRules(prevRules => 
            prevRules.map(rule => 
                rule.day_of_week === day_of_week ? { ...rule, isAvailable: !rule.isAvailable } : rule
            )
        );
    };

    if (rules.length === 0) {
        return <div>Loading availability...</div>;
    }

    return (
        <div className="availability-rules-editor">
            {rules.map(rule => (
                <div key={rule.day_of_week} className="rule-row">
                    <div className="rule-toggle">
                        <input
                            type="checkbox"
                            id={`toggle-${rule.day_of_week}`}
                            checked={rule.isAvailable}
                            onChange={() => handleToggleAvailability(rule.day_of_week)}
                        />
                        <label htmlFor={`toggle-${rule.day_of_week}`}>{rule.day_of_week}</label>
                    </div>

                    <div className="rule-time-inputs">
                        {rule.isAvailable ? (
                            <>
                                <input
                                    type="time"
                                    value={rule.start_time}
                                    onChange={(e) => handleRuleChange(rule.day_of_week, 'start_time', e.target.value)}
                                    className="time-input"
                                />
                                <span className="time-separator">to</span>
                                <input
                                    type="time"
                                    value={rule.end_time}
                                    onChange={(e) => handleRuleChange(rule.day_of_week, 'end_time', e.target.value)}
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