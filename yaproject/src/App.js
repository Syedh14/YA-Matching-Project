

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import pages
import Login from './pages/Login';
import TestHeaderPage from './pages/test'; // The page that uses Header
import ProgressReports from './progress_report/pr_page';
function App() {
  return (
    <Router>
      <Routes>
        {/* The login page route */}
        <Route path="/" element={<Login />} />
        
        {/* The route for testing the header */}
        <Route path="/test-header" element={<TestHeaderPage />} />

        <Route path="/" element={<Login />} />
        <Route path="/admin" element={<AdminDash />} />
        <Route path="/mentor" element={<MentorDash />} />
        <Route path="/mentee" element={<MenteeDash />} />
        
        {/* Add more routes here as needed */}
        <Route path="/progress_report" element={<ProgressReports />} />
      </Routes>
    </Router>
  );
}

export default App;
