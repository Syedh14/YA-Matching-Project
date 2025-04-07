// src/pages/TestHeaderPage.jsx
import React from 'react';
import Header from '../components/Header';

const MentorDashboard = () => {
  return (
    <div>
      <Header />
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Header Test Page</h1>
        <p>This page is just for testing the Header component.</p>
      </div>
    </div>
  );
};

export default MentorDashboard;