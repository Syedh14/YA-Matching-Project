

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import pages
import Login from './pages/Login';
import TestHeaderPage from './pages/test'; // The page that uses Header

function App() {
  return (
    <Router>
      <Routes>
        {/* The login page route */}
        <Route path="/" element={<Login />} />
        
        {/* The route for testing the header */}
        <Route path="/test-header" element={<TestHeaderPage />} />
        
        {/* Add more routes here as needed */}
      </Routes>
    </Router>
  );
}

export default App;
