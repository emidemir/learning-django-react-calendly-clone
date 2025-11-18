// Layout.jsx
import React from 'react';
import Navbar from './Navbar.jsx';
import DashboardSidebar from './DashboardSidebar.jsx'; // Will be created next
import '../../css/Layout.css'; // Correct relative import

const Layout = ({ children, useDashboardLayout = false, isLoggedIn = false }) => {
  return (
    <div className="app-container">
      {/* Navbar is always visible */}
      <Navbar isLoggedIn={isLoggedIn} />

      {useDashboardLayout && isLoggedIn ? (
        <div className="dashboard-layout">
          <DashboardSidebar />
          <main className="dashboard-content">
            {children}
          </main>
        </div>
      ) : (
        // Standard layout for public pages, auth pages, or non-dashboard views
        <main className="public-content">
          {children}
        </main>
      )}
    </div>
  );
};

export default Layout;