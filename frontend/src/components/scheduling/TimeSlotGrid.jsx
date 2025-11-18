// TimeSlotGrid.jsx
import React from 'react';
import '../../css/TimeSlotGrid.css'; // Correct relative import from components/scheduling

// Mock available slots for a selected date (this data will come from the backend API)
const mockSlots = [
  '09:00 AM',
  '09:30 AM',
  '10:00 AM',
  '10:30 AM',
  '11:00 AM',
  '11:30 AM',
  '01:00 PM',
  '01:30 PM',
];

const TimeSlotGrid = ({ selectedDate, onSlotSelect, selectedTime }) => {
  if (!selectedDate) {
    return <div className="time-grid-placeholder">Select a date to see available times.</div>;
  }

  const dateDisplay = new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });

  return (
    <div className="time-slot-grid-container">
      <h4 className="time-grid-title">Select a Time for {dateDisplay}</h4>
      <div className="time-slot-list">
        {mockSlots.length > 0 ? (
          mockSlots.map((time, index) => (
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