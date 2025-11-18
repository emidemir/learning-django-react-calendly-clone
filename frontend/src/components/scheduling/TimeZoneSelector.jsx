// TimeZoneSelector.jsx
import React, { useMemo } from 'react';
import '../../css/TimeZoneSelector.css';

const TimeZoneSelector = ({ currentTimeZone, onTimeZoneChange }) => {
    // List of common time zones (simplified for frontend mock)
    const timeZones = useMemo(() => [
        { value: 'America/New_York', label: 'Eastern Time (ET)' },
        { value: 'America/Chicago', label: 'Central Time (CT)' },
        { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
        { value: 'Europe/London', label: 'London (GMT)' },
        { value: 'Europe/Istanbul', label: 'Istanbul (GMT+3)' },
    ], []);

    const currentLabel = timeZones.find(tz => tz.value === currentTimeZone)?.label || currentTimeZone;

    return (
        <div className="timezone-selector">
            <label htmlFor="timezone-select" className="timezone-label">
                Time Zone: {currentLabel}
            </label>
            <select
                id="timezone-select"
                value={currentTimeZone}
                onChange={(e) => onTimeZoneChange(e.target.value)}
                className="timezone-select"
            >
                {timeZones.map(tz => (
                    <option key={tz.value} value={tz.value}>
                        {tz.label}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default TimeZoneSelector;