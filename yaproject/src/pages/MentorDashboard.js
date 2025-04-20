import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
  
const MenteeDashboard = () => {
  const [showMenteeModal, setShowMenteeModal] = useState(false);
  const [confirmedSessions, setConfirmedSessions] = useState([]);
  const [potentialSessions, setPotentialSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [sessionToReplace, setSessionToReplace] = useState(null);
  const [newSession, setNewSession] = useState({
    mentor_id: 2,
    mentee_id: 5,
    duration: "",
    topics_covered: "",
    session_type: "Online",
    session_date: "",
    location: ""
  });  


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
        duration: 60,
        mentor_name: "Alice Mentor",
        mentee_name: "Bob Mentee",
        session_status: "Potential"
      },
      {
        session_id: 4,
        session_date: "2025-04-27T11:00:00",
        duration: 45,
        mentor_name: "Alice Mentor",
        mentee_name: "Bob Mentee",
        session_status: "Potential"
      }
    ]);    
  }, []);

  const handleDeleteSession = (sessionId) => {
    setConfirmedSessions((prev) => prev.filter((s) => s.session_id !== sessionId));
  };
  
  

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
              className="relative bg-gray-100 hover:bg-gray-200 cursor-pointer transition rounded-lg p-4 shadow-sm hover:shadow-md"
              onClick={() => {
                if (!editMode) {
                  setSelectedSession(session);
                  setShowModal(true);
                }
              }}
            >
              {editMode && (
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // prevent triggering modal
                    handleDeleteSession(session.session_id);
                  }}
                  className="absolute top-2 right-2 text-white bg-red-500 hover:bg-red-600 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold"
                >
                  ×
                </button>
              )}
            
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

          <div className="mt-6 flex justify-end gap-3">
          <button
            className="bg-secondary text-white px-4 py-2 rounded hover:bg-primary transition"
            onClick={() => setEditMode((prev) => !prev)}
          >
            {editMode ? "Done" : "Edit"}
          </button>
          <button
            className="bg-secondary text-white px-4 py-2 rounded hover:bg-primary transition"
            onClick={() => {
              setNewSession({
                mentor_id: 2,      // hardcoded for now
                mentee_id: 5,
                duration: "",
                topics_covered: "",
                session_type: "Online",
                session_date: "",
                location: ""
              });
              setSessionToReplace(null);  // not coming from a potential session
              setShowAddModal(true);
            }}                
          >
            Add
          </button>
          </div>
        </div>

        {/* Right Column: Mentee Button + Potential Sessions */}
        <div className="flex flex-col gap-4 items-end w-80">
          {/* Mentee Info Button */}
          <button
            onClick={() => setShowMenteeModal(true)}
            className="w-full h-28 border border-gray-400 rounded bg-white shadow hover:bg-gray-100 text-sm text-gray-800 p-3 text-left"
          >
            <strong>Mentee Information</strong>
            <br />
            <span className="text-xs">(click here for details)</span>
          </button>
  
          {/* Potential Sessions */}
          <div className="w-full bg-white p-4 rounded shadow">
            <h2 className="text-lg font-bold mb-4">Potential Sessions</h2>
            <ul className="space-y-2">
              {potentialSessions.map((s, i) => (
                <li
                key={s.session_id}
                onClick={() => {
                  setNewSession({
                    mentor_id: 2, 
                    mentee_id: 5, 
                    duration: s.duration,
                    topics_covered: "", 
                    session_type: "Online",
                    session_date: s.session_date,
                    location: ""
                  });
                  setShowAddModal(true);
                  setSessionToReplace(s.session_id);
                }}
                className="text-sm bg-gray-100 p-2 rounded cursor-pointer hover:bg-gray-200 transition"
              >
                {new Date(s.session_date).toLocaleString()} – {s.mentor_name} with {s.mentee_name}
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-8 rounded-lg w-[36rem]">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold">Mentor Information</h2>
              <button
                className="text-xl font-bold text-red-500 hover:text-secondary transition"
                onClick={() => {setShowMenteeModal(false)}}
              >
                X
              </button>
            </div>
            <div>
                <p className="text-lg">
                  <span className="font-bold">User ID:</span> 3
                </p>
                <p className="text-lg mt-2">
                  <span className="font-bold">Name: </span> Talaal Irtija
                </p>
                <p className="text-lg mt-2">
                  <span className="font-bold">Phone: </span> 4039999213, 4031231233
                </p>
                <p className="text-lg mt-2">
                  <span className="font-bold">Email: </span>irtijat@gmail.com, talaal.irtija@ucalgary.ca
                </p>
                <p className="text-lg mt-2">
                  <span className="font-bold">Goals: </span>Get better at math
                </p>
                <p className="text-lg mt-2">
                  <span className="font-bold">Date Joined: </span>Today
                </p>
                <p className="text-lg mt-2">
                  <span className="font-bold">Skills: </span>PE
                </p>
                <p className="text-lg mt-2">
                  <span className="font-bold">Institution: </span>U of C
                </p>
                <p className="text-lg mt-2">
                  <span className="font-bold">Academic Status: </span>Failed
                </p>
            </div>
          </div>
        </div>
      )}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-lg max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-4">Add New Session</h3>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <input
                type="number"
                disabled
                className="border p-2 rounded bg-gray-100 text-gray-500"
                value={newSession.mentor_id}
              />
              <input
                type="number"
                disabled
                className="border p-2 rounded bg-gray-100 text-gray-500"
                value={newSession.mentee_id}
              />
              <input
                type="number"
                placeholder="Duration (minutes)"
                className="border p-2 rounded col-span-2"
                value={newSession.duration}
                onChange={(e) => setNewSession({ ...newSession, duration: e.target.value })}
              />
              <input
                type="text"
                placeholder="Topics Covered"
                className="border p-2 rounded col-span-2"
                value={newSession.topics_covered}
                onChange={(e) => setNewSession({ ...newSession, topics_covered: e.target.value })}
              />
              <select
                className="border p-2 rounded col-span-2"
                value={newSession.session_type}
                onChange={(e) => setNewSession({ ...newSession, session_type: e.target.value })}
              >
                <option value="Online">Online</option>
                <option value="In-Person">In-Person</option>
              </select>
              <input
                type="datetime-local"
                className="border p-2 rounded col-span-2"
                value={newSession.session_date}
                onChange={(e) => setNewSession({ ...newSession, session_date: e.target.value })}
              />
              <input
                type="text"
                placeholder="Location / Zoom Link"
                className="border p-2 rounded col-span-2"
                value={newSession.location}
                onChange={(e) => setNewSession({ ...newSession, location: e.target.value })}
              />
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowAddModal(false)}
                className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  const newEntry = {
                    ...newSession,
                    session_id: Date.now(),
                    session_status: "Actual"
                  };
                
                  setConfirmedSessions((prev) =>
                    [...prev, newEntry].sort((a, b) => new Date(a.session_date) - new Date(b.session_date))
                  );
                
                  if (sessionToReplace !== null) {
                    setPotentialSessions((prev) =>
                      prev.filter((s) => s.session_id !== sessionToReplace)
                    );
                    setSessionToReplace(null);
                  }
                
                  setShowAddModal(false);
                  setNewSession({
                    mentor_id: 2,
                    mentee_id: 5,
                    duration: "",
                    topics_covered: "",
                    session_type: "Online",
                    session_date: "",
                    location: ""
                  });
                }}
                
                className="bg-secondary text-white px-4 py-2 rounded hover:primary"
              >
                Add Session
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