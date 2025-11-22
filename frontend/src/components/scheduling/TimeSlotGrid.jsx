// src/components/scheduling/TimeSlotGrid.jsx
import React from 'react';
import '../../css/TimeSlotGrid.css';

// DELETE or COMMENT OUT the mockSlots array
// const mockSlots = [...]; 

const TimeSlotGrid = ({ selectedDate, onSlotSelect, selectedTime, availableSlots = [] }) => {
  if (!selectedDate) {
    return <div className="time-grid-placeholder">Select a date to see available times.</div>;
  }

  // Format date for header (e.g. "Friday, Nov 23")
  // Note: Ensure selectedDate string is parsed correctly to avoid timezone shifts in display
  // A simple way is to just parse the YYYY-MM-DD string manually or use the string directly
  const dateDisplay = new Date(selectedDate).toLocaleDateString('en-US', { 
      weekday: 'long', month: 'short', day: 'numeric', timeZone: 'UTC' 
  });

  return (
    <div className="time-slot-grid-container">
      <h4 className="time-grid-title">Select a Time for {dateDisplay}</h4>
      <div className="time-slot-list">
        {availableSlots.length > 0 ? (
          availableSlots.map((time, index) => (
            <button
              key={index}
              className={`time-slot-button ${selectedTime === time ? 'time-slot-button--selected' : ''}`}
              onClick={() => onSlotSelect(time)}
            >
              {time}
            </button>
          ))
        ) : (
          <div className="no-slots-message">No times available on this day.</div>
        )}
      </div>
    </div>
  );
};

export default TimeSlotGrid;