// src/progressReports/ProgressReports.jsx
import React, { useState } from 'react';
import Header from '../components/Header'; 
import ProgressReportModal from './progressreportmodal';

function ProgressReports() {
    const [selectedReport, setSelectedReport] = useState(null);
    const [showModal, setShowModal] = useState(false);
  
    
    const reports = [
      {
        id: 1,
        date: '2025-03-01',
        topic: 'Math Skills',
        areasOfImprovement: 'Algebra, Geometry',
        skillsImproved: 'Calculations, Problem Solving',
        challenges: 'Time management, complex equations',
      },
      {
        id: 2,
        date: '2025-03-08',
        topic: 'Science Project',
        areasOfImprovement: 'Research, Documentation',
        skillsImproved: 'Experimentation, Data Analysis',
        challenges: 'Resource gathering, time constraints',
      },
      {
        id: 3,
        date: '2025-03-15',
        topic: 'Reading Comprehension',
        areasOfImprovement: 'Vocabulary, Summarizing',
        skillsImproved: 'Critical Thinking, Speed Reading',
        challenges: 'Concentration, large volume of text',
      },
      {
        id: 4,
        date: '2025-03-15',
        topic: 'Reading Comprehension',
        areasOfImprovement: 'Vocabulary, Summarizing',
        skillsImproved: 'Critical Thinking, Speed Reading',
        challenges: 'Concentration, large volume of text',
      },
      {
        id: 5,
        date: '2025-03-15',
        topic: 'Reading Comprehension',
        areasOfImprovement: 'Vocabulary, Summarizing',
        skillsImproved: 'Critical Thinking, Speed Reading',
        challenges: 'Concentration, large volume of text',
      },
      {
        id: 6,
        date: '2025-03-15',
        topic: 'Reading Comprehension',
        areasOfImprovement: 'Vocabulary, Summarizing',
        skillsImproved: 'Critical Thinking, Speed Reading',
        challenges: 'Concentration, large volume of text',
      },
      {
        id: 7,
        date: '2025-03-15',
        topic: 'Reading Comprehension',
        areasOfImprovement: 'Vocabulary, Summarizing',
        skillsImproved: 'Critical Thinking, Speed Reading',
        challenges: 'Concentration, large volume of text',
      },
      {
        id: 8,
        date: '2025-03-15',
        topic: 'Reading Comprehension',
        areasOfImprovement: 'Vocabulary, Summarizing',
        skillsImproved: 'Critical Thinking, Speed Reading',
        challenges: 'Concentration, large volume of text',
      },
      {
        id: 9,
        date: '2025-03-15',
        topic: 'Reading Comprehension',
        areasOfImprovement: 'Vocabulary, Summarizing',
        skillsImproved: 'Critical Thinking, Speed Reading',
        challenges: 'Concentration, large volume of text',
      },
      {
        id: 10,
        date: '2025-03-15',
        topic: 'Reading Comprehension',
        areasOfImprovement: 'Vocabulary, Summarizing',
        skillsImproved: 'Critical Thinking, Speed Reading',
        challenges: 'Concentration, large volume of text',
      },
      {
        id: 11,
        date: '2025-03-15',
        topic: 'Reading Comprehension',
        areasOfImprovement: 'Vocabulary, Summarizing',
        skillsImproved: 'Critical Thinking, Speed Reading',
        challenges: 'Concentration, large volume of text',
      },
    ];
  
    const handleCardClick = (report) => {
      setSelectedReport(report);
      setShowModal(true);
    };
  
    const closeModal = () => {
      setSelectedReport(null);
      setShowModal(false);
    };
  
    return (
      <div>
        <Header />
        <div className="bg-white p-4">
          {/* Title and Sort Button */}
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold">Progress Reports</h1>
            <button className="bg-secondary text-white px-4 py-2 rounded">
              Sort By
            </button>
          </div>
  
          {/* Scrollable container */}
          <div className="h-[80vh] overflow-y-auto border p-4">
            <div className="grid grid-cols-3 gap-4">
              {reports.map((report) => (
                <div
                  key={report.id}
                  className="border p-16 flex flex-col items-center justify-center bg-
                             hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => handleCardClick(report)}
                >
                  <div className="text-gray-800 text-lg mb-2">
                    Progress Report
                  </div>
                  <div className="text-gray-500 text-sm">
                    {`Date: ${report.date}`}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
  
        {/* The Modal Pop-up */}
        {showModal && selectedReport && (
          <ProgressReportModal
            report={selectedReport}
            onClose={closeModal}
          />
        )}
      </div>
    );
  }
  
  export default ProgressReports;