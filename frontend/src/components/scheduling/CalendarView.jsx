import React, { useState } from 'react';
import '../../css/CalendarView.css';

const CalendarView = ({ onDateSelect, availableDates = [] }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Helper functions
  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay(); 
  
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  
  const calendarDays = [];
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Fill empty slots
  for (let i = 0; i < firstDay; i++) {
    calendarDays.push(null);
  }

  // Fill actual days
  for (let day = 1; day <= daysInMonth; day++) {
    const fullDate = new Date(year, month, day);
    
    // --- FIX: Use Local Time to construct YYYY-MM-DD ---
    const localYear = fullDate.getFullYear();
    const localMonth = String(fullDate.getMonth() + 1).padStart(2, '0');
    const localDay = String(fullDate.getDate()).padStart(2, '0');
    const dateString = `${localYear}-${localMonth}-${localDay}`;
    // ---------------------------------------------------

    // Check if this specific date string exists in the keys of our availability map
    const isAvailable = availableDates.includes(dateString);

    calendarDays.push({ day, fullDate, dateString, isAvailable });
  }
  
  const formattedMonth = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const handleMonthChange = (offset) => {
    const newDate = new Date(currentDate.setMonth(currentDate.getMonth() + offset));
    setCurrentDate(newDate);
    // Optional: You might want to trigger a refetch of availability here in the parent
  };
  
  const handleDateClick = (date) => {
      if (date.isAvailable) {
          onDateSelect(date.dateString);
      }
  };

  return (
    <div className="calendar-view">
      <div className="calendar-header">
        <button onClick={() => handleMonthChange(-1)} className="nav-button">&lt;</button>
        <h3 className="month-title">{formattedMonth}</h3>
        <button onClick={() => handleMonthChange(1)} className="nav-button">&gt;</button>
      </div>

      <div className="calendar-grid">
        {daysOfWeek.map(day => <div key={day} className="day-name">{day}</div>)}
        
        {calendarDays.map((date, index) => (
          <div 
            key={index} 
            className={`calendar-day ${date && date.isAvailable ? 'available' : ''} ${!date ? 'empty' : ''}`}
            onClick={date ? () => handleDateClick(date) : null}
          >
            {date ? date.day : ''}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CalendarView;