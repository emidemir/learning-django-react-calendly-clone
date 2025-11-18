// DashboardSidebar.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../../css/DashboardSidebar.css'; // Correct relative import

const navItems = [
  { name: 'Dashboard', path: '/dashboard', icon: '🏠' },
  { name: 'Event Types', path: '/event-types', icon: '📅' },
  { name: 'Scheduled Events', path: '/scheduled-events', icon: '✅' },
  { name: 'Availability', path: '/availability', icon: '⏱️' },
  { name: 'Integrations', path: '/settings/integrations', icon: '🔗' },
  { name: 'Account Settings', path: '/settings/profile', icon: '⚙️' },
];

const DashboardSidebar = () => {
  const location = useLocation();

  return (
    <aside className="sidebar">
      <nav className="sidebar__nav">
        {navItems.map(item => (
          <Link
            key={item.path}
            to={item.path}
            className={`sidebar__item ${location.pathname.startsWith(item.path) ? 'sidebar__item--active' : ''}`}
          >
            <span className="sidebar__icon">{item.icon}</span>
            <span className="sidebar__text">{item.name}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default DashboardSidebar;