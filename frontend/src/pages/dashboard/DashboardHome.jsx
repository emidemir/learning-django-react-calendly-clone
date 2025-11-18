// DashboardHome.jsx
import React from 'react';
import Layout from '../../components/layout/Layout.jsx';
import Button from '../../components/core-ui/Button.jsx';
import { Link } from 'react-router-dom';
import '../../css/DashboardHome.css';

const DashboardHome = () => {
  // Placeholder data for demonstration
  const upcomingEvents = 3;
  const recentViews = 45;
  
  return (
    <Layout useDashboardLayout={true} isLoggedIn={true}>
      <div className="dashboard-header">
        <h2>👋 Welcome Back, Host!</h2>
        <Link to="/event-types/create">
          <Button variant="primary">
            + Create New Event Type
          </Button>
        </Link>
      </div>
      
      <div className="dashboard-summary-grid">
        <div className="summary-card">
          <h3>Upcoming Events</h3>
          <p className="summary-number">{upcomingEvents}</p>
          <Link to="/scheduled-events">View Details</Link>
        </div>
        
        <div className="summary-card">
          <h3>Link Views (30 Days)</h3>
          <p className="summary-number">{recentViews}</p>
          <Link to="/event-types">Manage Events</Link>
        </div>
        
        {/* Placeholder for future integration status */}
        <div className="summary-card summary-card--integration">
          <h3>Google Calendar</h3>
          <p className="summary-status">🔗 Not Connected</p>
          <Link to="/settings/integrations">Connect Now</Link>
        </div>
      </div>
      
      <section className="dashboard-activity">
          <h3>Recent Activity</h3>
          <p className="activity-placeholder">
              No recent bookings yet. Share your link to get started!
          </p>
      </section>
      
    </Layout>
  );
};

export default DashboardHome;