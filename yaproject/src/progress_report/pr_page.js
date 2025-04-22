


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


  // NEW: fetch only this mentor's mentees
      useEffect(() => {
        if (role !== 'mentor' || !user) return;

        axios
          .get(
            `http://localhost:5001/progress_report/mentor/${user.user_id}/mentees`,
            { withCredentials: true }
          )
          .then(res => setMentees(res.data))
          .catch(err => console.error('Failed to fetch my mentees', err));
      }, [role, user]);


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
        // Basic client‐side guard
        if (!newReport.menteeId) {
          return alert("Please select a mentee before submitting.");
        }
      
        try {
          // post to the same mount point you declared in index.js:
          const { data } = await axios.post(
            'http://localhost:5001/progress_report',
            {
              menteeId: newReport.menteeId,
              areasOfImprovement: newReport.areasOfImprovement,
              skillsImproved: newReport.skillsImproved,
              challenges: newReport.challenges,
            },
            { withCredentials: true }
          );
      
          // prepend the new report so it appears immediately
          setReports(r => [data, ...r]);
      
          // close modal + reset form
          setShowAddModal(false);
          setNewReport({
            menteeId: '',
            areasOfImprovement: '',
            skillsImproved: '',
            challenges: '',
          });
        } catch (err) {
          console.error("Error adding report:", err);
          alert(err.response?.data?.error || err.message);
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
      
            {sortedReports.length === 0 ? (
              <p className="text-center text-gray-500 my-8">
                There are no reports made yet.
              </p>
            ) : (
              <div className="grid gap-4">
                {sortedReports.map((report) => (
                  <div
                    key={report.report_id}
                    className="border p-4 rounded shadow hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleCardClick(report)}
                  >
                    <p><strong>ID:</strong> {report.report_id}</p>
                    <p>
                      <strong>Date:</strong>{' '}
                      {report.date_created
                        ? new Date(report.date_created).toLocaleDateString()
                        : 'N/A'}
                    </p>
                    <p><strong>Mentee ID:</strong> {report.mentee_id}</p>
                  </div>
                ))}
              </div>
            )}
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
