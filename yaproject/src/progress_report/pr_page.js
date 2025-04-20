// // src/progressReports/ProgressReports.jsx
// import React, { useState, useEffect } from 'react';
// import Header from '../components/Header'; 
// import ProgressReportModal from './progressreportmodal';
// import AddProgressReportModal from './AddProgressReportModal';
// import axios from 'axios';

// function ProgressReports() {
//     const [selectedReport, setSelectedReport] = useState(null);
//     const [showModal, setShowModal] = useState(false);
//     const [showAddModal, setShowAddModal] = useState(false);
//     const [sortBy, setSortBy] = useState('id');
//     const [reports, setReports] = useState([]);
//     useEffect(() => {
//       const fetchReports = async () => {
//         try {
//           const response = await axios.get('http://localhost:5001/api/progress_report');
//           setReports(response.data);
//         } catch (error) {
//           console.error('Error fetching reports:', error);
//         }
//       };
    
//       fetchReports();
//     }, []);
    
    
//     const [role, setRole] = useState('');
//     const [showAddForm, setShowAddForm] = useState(false);
//     const [newReport, setNewReport] = useState({
//       areasOfImprovement: '',
//       skillsImproved: '',
//       challenges: '',
//     });
    
//     useEffect(() => {
//       // On component mount, fetch the current user session info
//       axios.get("http://localhost:5001/auth/me", { withCredentials: true })
//         .then(res => {
//           if (res.data.role) {
//             // Set role from session (make sure it matches expected format)
//             setRole(res.data.role.toLowerCase()); 
//           } else {
//             setRole('');
//           }
//         })
//         .catch(err => {
//           console.error("Failed to fetch session role", err);
//           setRole('');
//         });
//     }, []);

  
//     const handleCardClick = (report) => {
//       setSelectedReport(report);
//       setShowModal(true);
//     };
  
//     const closeModal = () => {
//       setSelectedReport(null);
//       setShowModal(false);
//     };
  
//    const sortedReports = [...reports].sort((a, b) => {
//       if (sortBy === 'id') {
//         // Sort by ID (ascending)
//         return a.id - b.id;
//       } else {
//         // Sort by Date (ascending)
//         return new Date(a.date) - new Date(b.date);
//       }
//     });
  
//       // NEW: Handle the "Sort By" button click
//     // Toggles between 'id' and 'date'
//     const handleSortBy = () => {
//       setSortBy(sortBy === 'id' ? 'date' : 'id');
//     };
  

//     const handleNewReportChange = (e) => {
//       setNewReport({ ...newReport, [e.target.name]: e.target.value });
//     };
  


//     const handleAddReport = async () => {
//       try {
//         const response = await axios.post('http://localhost:5001/api/progress_report', newReport);
//         setReports([...reports, response.data]);
//         setShowAddModal(false);
//         setNewReport({areasOfImprovement: '', skillsImproved: '', challenges: '' });
//       } catch (error) {
//         console.error('Error adding report:', error);
//       }
//     };
    
    

  
// return (
//   <div>
//     <Header />
//     <div className="bg-white p-4">
//       {/* Title and Sort Button */}
//       <div className="flex justify-between items-center mb-4">
//         <h1 className="text-2xl font-bold">Progress Reports</h1>
//         <button
//           onClick={handleSortBy}
//           className="bg-secondary text-white px-4 py-2 rounded"
//         >
//           Sort By {sortBy === 'id' ? 'Date' : 'ID'}
//         </button>
//         {role === 'mentor' && (
//           <button
//             className="fixed bottom-8 right-8 bg-red-600 text-white text-3xl rounded-full w-14 h-14 flex items-center justify-center shadow-lg hover:bg-red-700 transition-all"
//             onClick={() => setShowAddForm(true)}
//           >
//             +
//           </button>
//         )}
//       </div>
//     </div>

//     {/* Add Report Form */}
//     {showAddForm && (
//       <div className="mb-4 border p-4 rounded bg-gray-100">
//         <h2 className="font-semibold text-lg mb-2">New Report</h2>

//         <input
//           type="text"
//           name="areasOfImprovement"
//           placeholder="Areas of Improvement"
//           className="border p-2 mb-2 w-full"
//           value={newReport.areasOfImprovement}
//           onChange={handleNewReportChange}
//         />
//         <input
//           type="text"
//           name="skillsImproved"
//           placeholder="Skills Improved"
//           className="border p-2 mb-2 w-full"
//           value={newReport.skillsImproved}
//           onChange={handleNewReportChange}
//         />
//         <input
//           type="text"
//           name="challenges"
//           placeholder="Challenges"
//           className="border p-2 mb-2 w-full"
//           value={newReport.challenges}
//           onChange={handleNewReportChange}
//         />
//         <div className="flex gap-2">
//           <button
//             className="bg-blue-500 text-white px-4 py-2 rounded"
//             onClick={handleAddReport}
//           >
//             Submit
//           </button>
//           <button
//             className="bg-gray-300 px-4 py-2 rounded"
//             onClick={() => setShowAddForm(false)}
//           >
//             Cancel
//           </button>
//         </div>
//       </div>
//     )}

//     {/* Scrollable Report Grid */}
//     <div className="h-[70vh] overflow-y-auto border p-4">
//       <div className="grid grid-cols-3 gap-4">
//         {reports.map((report) => (
//           <div
//             key={report.id}
//             className="border p-6 flex flex-col items-center justify-center hover:shadow-md transition-shadow cursor-pointer"
//             onClick={() => handleCardClick(report)}
//           >
//             <p><strong>{report.id}</strong></p>
//             <p>{report.date}</p>
//           </div>
//         ))}
//       </div>
//     </div>

//     {showModal && (
//       <ProgressReportModal report={selectedReport} onClose={closeModal} />
//     )}

//     {showAddModal && (
//       <AddProgressReportModal
//         newReport={newReport}
//         setNewReport={setNewReport}
//         onSubmit={handleAddReport}
//         onClose={() => setShowAddModal(false)}
//       />
//     )}

//   </div>
// )};

// export default ProgressReports;


import React, { useState, useEffect } from 'react';
import Header from '../components/Header'; 
import ProgressReportModal from './progressreportmodal';
import AddProgressReportModal from './AddProgressReportModal';
import axios from 'axios';

function ProgressReports() {
  const [selectedReport, setSelectedReport] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [sortBy, setSortBy] = useState('id');
  const [reports, setReports] = useState([]);
  const [mentees, setMentees] = useState([]);
  const [role, setRole] = useState('');
  const [user, setUser] = useState(null);
  const [newReport, setNewReport] = useState({
    menteeId: '',
    areasOfImprovement: '',
    skillsImproved: '',
    challenges: '',
  });

  useEffect(() => {
    axios.get("http://localhost:5001/auth/profile", { withCredentials: true })
      .then(res => {
        setUser(res.data);  
      })
      .catch(err => {
        console.error("Failed to fetch profile data", err);
        setUser(null);
      });
  }, []);



  // useEffect(() => {
  //   // Fetch reports
  //   const fetchReports = async () => {
  //     try {
  //       if (user) {
  //         if (user.role === 'mentor'){
  //           const response = await axios.get('http://localhost:5001/api/progress_report');
  //           setReports(response.data);
  //         }else if (user.role === "mentee"){
  //           const response = await axios.get('http://localhost:5001/api/progress_report');
  //           setReports(response.data);
  //         }
  //       }
      
  //     } catch (error) {
  //       console.error('Error fetching reports:', error);
  //     }
  //   };

  //   fetchReports();
  // }, []);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        if (user) {
          const endpoint = user.role === 'mentor'
            ? `http://localhost:5001/progress_report/mentor/${user.user_id}`
            : `http://localhost:5001/progress_report/mentee/${user.user_id}`;
  
          const response = await axios.get(endpoint, { withCredentials: true });
          setReports(response.data);
        }
      } catch (error) {
        console.error('Error fetching reports:', error);
      }
    };
  
    fetchReports();
  }, [user]);
  




  useEffect(() => {
    // Fetch user role
    axios.get("http://localhost:5001/auth/me", { withCredentials: true })
      .then(res => {
        if (res.data.role) {
          setRole(res.data.role.toLowerCase());
        }
      })
      .catch(err => {
        console.error("Failed to fetch session role", err);
      });
  }, []);

  useEffect(() => {
    // Fetch mentees list
    const fetchMentees = async () => {
      try {
        const response = await axios.get("http://localhost:5001/api/mentees");
        setMentees(response.data);
      } catch (err) {
        console.error("Failed to fetch mentees", err);
      }
    };

    if (role === 'mentor') {
      fetchMentees();
    }
  }, [role]);

  const handleCardClick = (report) => {
    setSelectedReport(report);
    setShowModal(true);
  };

  const closeModal = () => {
    setSelectedReport(null);
    setShowModal(false);
  };

  const sortedReports = [...reports].sort((a, b) => {
    return sortBy === 'id'
      ? a.id - b.id
      : new Date(a.date) - new Date(b.date);
  });

  const handleSortBy = () => {
    setSortBy(sortBy === 'id' ? 'date' : 'id');
  };

  const handleAddReport = async () => {
    try {
      const response = await axios.post('http://localhost:5001/api/progress_report', newReport);
      setReports([...reports, response.data]);
      setShowAddModal(false);
      setNewReport({
        menteeId: '',
        areasOfImprovement: '',
        skillsImproved: '',
        challenges: ''
      });
    } catch (error) {
      console.error('Error adding report:', error);
    }
  };

  return (
    <div>
      <Header />
      <div className="bg-white p-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Progress Reports</h1>
          <button
            onClick={handleSortBy}
            className="bg-secondary text-white px-4 py-2 rounded"
          >
            Sort By {sortBy === 'id' ? 'Date' : 'ID'}
          </button>
          {role === 'mentor' && (
            <button
              className="fixed bottom-8 right-8 bg-red-600 text-white text-3xl rounded-full w-14 h-14 flex items-center justify-center shadow-lg hover:bg-red-700 transition-all"
              onClick={() => setShowAddModal(true)}
            >
              +
            </button>
          )}
        </div>

        {/* Render sorted reports */}
        <div className="grid gap-4">
          {sortedReports.map((report) => (
            <div
              key={report.id}
              className="border p-4 rounded shadow hover:bg-gray-100 cursor-pointer"
              onClick={() => handleCardClick(report)}
            >
              <p><strong>ID:</strong> {report.id}</p>
              <p><strong>Date:</strong> {report.date}</p>
              <p><strong>Mentee ID:</strong> {report.mentee_id}</p>
            </div>
          ))}
        </div>
      </div>

      {/* View Report Modal */}
      {showModal && (
        <ProgressReportModal report={selectedReport} onClose={closeModal} />
      )}

      {/* Add Report Modal */}
      {showAddModal && (
        <AddProgressReportModal
          newReport={newReport}
          setNewReport={setNewReport}
          onSubmit={handleAddReport}
          onClose={() => setShowAddModal(false)}
          mentees={mentees}
        />
      )}
    </div>
  );
}

export default ProgressReports;
