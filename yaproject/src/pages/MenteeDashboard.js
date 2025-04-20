import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
  
const MenteeDashboard = () => {
  const [showMenteeModal, setShowMenteeModal] = useState(false);
  const [confirmedSessions, setConfirmedSessions] = useState([]);
  const [potentialSessions, setPotentialSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    setConfirmedSessions([
      {
        session_id: 1,
        session_date: "2025-04-21T14:00:00",
        session_type: "In-Person",
        topics_covered: "React Basics",
        duration: 60,
        location: "Room 305, Tech Building",
        session_status: "Actual",
        mentor_name: "Alice Mentor",
        mentee_name: "Bob Mentee"
      },
      {
        session_id: 2,
        session_date: "2025-04-23T10:30:00",
        session_type: "Online",
        topics_covered: "Intro to SQL",
        duration: 45,
        location: "https://zoom.us/j/123456789",
        session_status: "Actual", 
        mentor_name: "Alice Mentor",
        mentee_name: "Bob Mentee"
      }
    ]);
    
    setPotentialSessions([
      {
        session_id: 3,
        session_date: "2025-04-25T15:00:00",
        topics_covered: "JavaScript Advanced",
        session_status: "Potential"
      },
      {
        session_id: 4,
        session_date: "2025-04-27T11:00:00",
        topics_covered: "Data Structures in Python",
        session_status: "Potential"
      }
    ]);    
  }, []);
  

  return (
    <div>
      <Header />
      <div className="flex p-6 gap-6 items-start">
        {/* Confirmed Sessions (slightly smaller) */}
        <div className="flex-[2] bg-white p-4 rounded shadow">
          <h2 className="text-lg font-bold mb-4">My Confirmed Sessions</h2>
  
          <div className="space-y-4">
            {confirmedSessions.map((session) => (
              <div
                key={session.session_id}
                onClick={() => {
                  setSelectedSession(session);
                  setShowModal(true);
                }}
                className="bg-gray-100 hover:bg-gray-200 cursor-pointer transition rounded-lg p-4 shadow-sm hover:shadow-md"
              >
                <div className="text-base font-semibold mb-1">
                  {new Date(session.session_date).toLocaleString()}
                </div>
                <div className="text-sm text-gray-700">
                  Type: <span className="font-medium">{session.session_type}</span> | Topic:{" "}
                  <span className="font-medium">{session.topics_covered}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
  
        {/* Right Column: Mentee Button + Potential Sessions */}
        <div className="flex flex-col gap-4 items-end w-80">
          {/* Mentee Info Button */}
          <button
            onClick={() => setShowMenteeModal(true)}
            className="w-full h-28 border border-gray-400 rounded bg-white shadow hover:bg-gray-100 text-sm text-gray-800 p-3 text-left"
          >
            <strong>Mentee Info...</strong>
            <br />
            <span className="text-xs">(click here for details)</span>
          </button>
  
          {/* Potential Sessions */}
          <div className="w-full bg-white p-4 rounded shadow">
            <h2 className="text-lg font-bold mb-4">Potential Sessions</h2>
            <ul className="space-y-2">
              {potentialSessions.map((s, i) => (
                <li key={i} className="text-sm bg-gray-100 p-2 rounded">
                  {new Date(s.session_date).toLocaleDateString()} - {s.topics_covered}
                </li>
              ))}
            </ul>
          </div>
        </div>
  
        {/* Session Info Modal */}
        {showModal && selectedSession && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded shadow-lg max-w-md w-full">
              <h3 className="text-xl font-bold mb-4">Session Details</h3>
              <p><strong>Date:</strong> {new Date(selectedSession.session_date).toLocaleString()}</p>
              <p><strong>Type:</strong> {selectedSession.session_type}</p>
              <p><strong>Topics:</strong> {selectedSession.topics_covered}</p>
              <p><strong>Duration:</strong> {selectedSession.duration} mins</p>
              {selectedSession.session_type === "Online" ? (
                <p>
                  <strong>Zoom:</strong>{" "}
                  <a
                    href={selectedSession.location}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline hover:text-blue-800"
                  >
                    {selectedSession.location}
                  </a>
                </p>
              ) : (
                <p><strong>Location:</strong> {selectedSession.location}</p>
              )}
              <div className="mt-4 text-right">
                <button
                  className="bg-gray-300 px-4 py-2 rounded"
                  onClick={() => setShowModal(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
  
        {/* Mentee Info Modal */}
        {showMenteeModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded shadow-lg max-w-md w-full">
              <h3 className="text-xl font-bold mb-4">Mentee Information</h3>
              <p><strong>Name:</strong> Bob Mentee</p>
              <p><strong>Academic Status:</strong> Undergraduate</p>
              <p><strong>Institution:</strong> University of XYZ</p>
              <p><strong>Goal:</strong> Improve coding skills</p>
              <p><strong>Skills:</strong> Basic Python</p>
  
              <div className="mt-4 text-right">
                <button
                  onClick={() => setShowMenteeModal(false)}
                  className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
  
};

export default MenteeDashboard;