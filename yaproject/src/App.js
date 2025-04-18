

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import pages
import Login from './pages/Login';
import TestHeaderPage from './pages/test'; // The page that uses Header
import ProgressReports from './progress_report/pr_page';
import AdminDashboard from './pages/AdminDashboard';
import MentorDashboard from './pages/MentorDashboard';
import MenteeDashboard from './pages/MenteeDashboard';
import Resources from './resources/Resources';
import AdminMatches from './pages/AdminMatches';



function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        
        <Route path="/test-header" element={<TestHeaderPage />} />

        <Route path="/" element={<Login />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin-matches" element={<AdminMatches />} />
        <Route path="/mentor" element={<MentorDashboard />} />
        <Route path="/mentee" element={<MenteeDashboard />} />
        
        <Route path="/progress_report" element={<ProgressReports />} />

        <Route path="/resources" element={<Resources />} />
      </Routes>
    </Router>
  );
}

export default App;
