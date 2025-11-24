import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import EventSelection from './pages/scheduling/EventSelection'
import TimeSelection from './pages/scheduling/TimeSelection'
import BookingForm from './pages/scheduling/BookingForm'
import BookingConfirmation from './pages/scheduling/BookingConfirmation'
import EventAction from './pages/scheduling/EventAction'

import LoginPage from './pages/authentication/LoginPage'
import SignupPage from './pages/authentication/SignupPage'

import EventTypesManager from './pages/dashboard/EventTypesManager'
import DashboardHome from './pages/dashboard/DashboardHome'
import EventTypeEditor from './pages/dashboard/EventTypeEditor'
import ScheduledEvents from './pages/dashboard/ScheduledEvents'
import AvailabilitySettings from './pages/dashboard/AvailabilitySettings'
import IntegrationsSettings from './pages/dashboard/IntegrationsSettings'
import ProfileSettings from './pages/dashboard/ProfileSettings'

const router = createBrowserRouter([
  {path:'/', element: <App/>},
  // Scheduling
  {path:'/:username', element:<EventSelection/>},
  {path:'/:username/:eventSlug', element:<TimeSelection/>},
  {path:'/:username/:eventSlug/details', element:<BookingForm/>},
  {path:'/success', element:<BookingConfirmation/>},
  {path:'/event/:id/reschedule', element:<EventAction/>},
  
  // Authentication
  {path:'/login', element:<LoginPage/>},
  {path:'/signup', element:<SignupPage/>},
  
  // Dashboard
  {path:'/dashboard', element:<DashboardHome/>},
  {path:'/event-types', element:<EventTypesManager/>},
  {path:'/event-types/create', element:<EventTypeEditor/>},
  {path:'/event-types/:eventID/edit', element:<EventTypeEditor/>},
  {path:'/scheduled-events', element:<ScheduledEvents/>},
  {path:'/availability', element:<AvailabilitySettings/>},
  {path:'/settings/integrations', element:<IntegrationsSettings/>},
  {path:'/settings/profile', element:<ProfileSettings/>},
])

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router}/>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
