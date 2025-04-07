// src/progressReports/ProgressReports.jsx
import React, { useState, useEffect } from 'react';
import Header from '../components/Header'; 
import ProgressReportModal from './progressreportmodal';

function ProgressReports() {
    const [selectedReport, setSelectedReport] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [reports, setReports] = useState([
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
      }

    ]);

    const [role, setRole] = useState('');
    const [showAddForm, setShowAddForm] = useState(false);
    const [newReport, setNewReport] = useState({
      topic: '',
      areasOfImprovement: '',
      skillsImproved: '',
      challenges: '',
    });
    
    useEffect(() => {
      const storedRole = localStorage.getItem('userRole');
      setRole(storedRole || '');
    }, []);

  
    const handleCardClick = (report) => {
      setSelectedReport(report);
      setShowModal(true);
    };
  
    const closeModal = () => {
      setSelectedReport(null);
      setShowModal(false);
    };

    const handleNewReportChange = (e) => {
      setNewReport({ ...newReport, [e.target.name]: e.target.value });
    };
  
    const handleAddReport = () => {
      const reportToAdd = {
        id: reports.length + 1,
        date: new Date().toISOString().split('T')[0],
        ...newReport,
      };
      setReports([...reports, reportToAdd]);
      setNewReport({
        topic: '',
        areasOfImprovement: '',
        skillsImproved: '',
        challenges: '',
      });
      setShowAddForm(false);
    };
  
  //   return (
  //     <div>
  //       <Header />
  //       <div className="bg-white p-4">
  //         {/* Title and Sort Button */}
  //         <div className="flex justify-between items-center mb-4">
  //           <h1 className="text-2xl font-bold">Progress Reports</h1>
  //           <button className="bg-secondary text-white px-4 py-2 rounded">
  //             Sort By
  //           </button>
  //         </div>
  
  //         {/* Scrollable container */}
  //         <div className="h-[80vh] overflow-y-auto border p-4">
  //           <div className="grid grid-cols-3 gap-4">
  //             {reports.map((report) => (
  //               <div
  //                 key={report.id}
  //                 className="border p-16 flex flex-col items-center justify-center bg-
  //                            hover:shadow-md transition-shadow cursor-pointer"
  //                 onClick={() => handleCardClick(report)}
  //               >
  //                 <div className="text-gray-800 text-lg mb-2">
  //                   Progress Report
  //                 </div>
  //                 <div className="text-gray-500 text-sm">
  //                   {`Date: ${report.date}`}
  //                 </div>
  //               </div>
  //             ))}
  //           </div>
  //         </div>
  //       </div>
  
  //       {/* The Modal Pop-up */}
  //       {showModal && selectedReport && (
  //         <ProgressReportModal
  //           report={selectedReport}
  //           onClose={closeModal}
  //         />
  //       )}
  //     </div>
  //   );
  // }
  
  // export default ProgressReports;

  return (
    <div>
      <Header />
      <div className="bg-white p-4">
        {/* Title and Sort Button */}
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Progress Reports</h1>
          <div className="flex gap-2">
            <button className="bg-secondary text-white px-4 py-2 rounded">
              Sort By
            </button>
            {role === 'mentor' && (
              <button
              className="fixed bottom-8 right-8 bg-red-600 text-white text-3xl rounded-full w-14 h-14 flex items-center justify-center shadow-lg hover:bg-red-700 transition-all"
              onClick={() => setShowAddForm(true)}
            >
              +
              </button>
            )}
          </div>
        </div>

        {/* Add Report Form */}
        {showAddForm && (
          <div className="mb-4 border p-4 rounded bg-gray-100">
            <h2 className="font-semibold text-lg mb-2">New Report</h2>
            <input
              type="text"
              name="topic"
              placeholder="Topic"
              className="border p-2 mb-2 w-full"
              value={newReport.topic}
              onChange={handleNewReportChange}
            />
            <input
              type="text"
              name="areasOfImprovement"
              placeholder="Areas of Improvement"
              className="border p-2 mb-2 w-full"
              value={newReport.areasOfImprovement}
              onChange={handleNewReportChange}
            />
            <input
              type="text"
              name="skillsImproved"
              placeholder="Skills Improved"
              className="border p-2 mb-2 w-full"
              value={newReport.skillsImproved}
              onChange={handleNewReportChange}
            />
            <input
              type="text"
              name="challenges"
              placeholder="Challenges"
              className="border p-2 mb-2 w-full"
              value={newReport.challenges}
              onChange={handleNewReportChange}
            />
            <div className="flex gap-2">
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded"
                onClick={handleAddReport}
              >
                Submit
              </button>
              <button
                className="bg-gray-300 px-4 py-2 rounded"
                onClick={() => setShowAddForm(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Scrollable Report Grid */}
        <div className="h-[70vh] overflow-y-auto border p-4">
          <div className="grid grid-cols-3 gap-4">
            {reports.map((report) => (
              <div
                key={report.id}
                className="border p-6 flex flex-col items-center justify-center hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => handleCardClick(report)}
              >
                <p><strong>{report.topic}</strong></p>
                <p>{report.date}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal for Viewing Report */}
      {showModal && (
        <ProgressReportModal report={selectedReport} onClose={closeModal} />
      )}
    </div>
  );
}

export default ProgressReports;