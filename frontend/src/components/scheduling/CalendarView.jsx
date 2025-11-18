// CalendarView.jsx
import React, { useState } from 'react';
import '../../css/CalendarView.css';

const CalendarView = ({ onDateSelect, availableDates = [] }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Helper functions to manage month view
  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay(); // 0 (Sun) to 6 (Sat)
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  
  // Array of days for rendering the calendar grid
  const calendarDays = [];
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Fill in preceding blank days
  for (let i = 0; i < firstDay; i++) {
    calendarDays.push(null);
  }

  // Fill in days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    const fullDate = new Date(year, month, day);
    const dateString = fullDate.toISOString().split('T')[0];
    const isAvailable = availableDates.includes(dateString); // Check against passed available dates

    calendarDays.push({ day, fullDate, dateString, isAvailable });
  }
  
  const formattedMonth = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const handleMonthChange = (offset) => {
    const newDate = new Date(currentDate.setMonth(currentDate.getMonth() + offset));
    setCurrentDate(newDate);
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