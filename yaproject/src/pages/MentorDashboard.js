import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import axios from 'axios';
  
const MenteeDashboard = () => {
  const [user, setUser] = useState(null);
  const [showMenteeModal, setShowMenteeModal] = useState(false);
  const [confirmedSessions, setConfirmedSessions] = useState([]);
  const [potentialSessions, setPotentialSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);
  const [assignedMentees, setAssignedMentees] = useState([]);
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
  const [selectedMentee, setSelectedMentee] = useState(null);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbackScore, setFeedbackScore] = useState(3);
  const [feedbackComment, setFeedbackComment] = useState('');
  const [showFeedbackList, setShowFeedbackList] = useState(false);
  const [feedbackList, setFeedbackList] = useState([]);

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

    const fetchSessions = async () => {
      try {
        const res = await axios.get(`http://localhost:5001/sessions/mentorSessions/${user.user_id}`, {
          withCredentials: true
        });
  
        setConfirmedSessions(res.data.confirmed);
        setPotentialSessions(res.data.potential);
      } catch (err) {
        console.error("Failed to fetch mentor sessions:", err);
      }
    };

    if (user) {
      if (user?.role === "mentor") {
        fetchSessions();
      }
    }   
  }, [user]);
  

  const handleDeleteSession = async (sessionId) => {
    try {
      await axios.delete(`http://localhost:5001/sessions/deleteSessions/${sessionId}`, {
        withCredentials: true,
      });
  
      setConfirmedSessions((prev) => prev.filter((s) => s.session_id !== sessionId));
    } catch (error) {
      console.error("Failed to delete session:", error);
    }
  };
  

  useEffect(() => {
    const fetchMentees = async () => {
      try {
        const response = await axios.get('http://localhost:5001/feedback/mentor/mentees', { withCredentials: true });
        setAssignedMentees(response.data);
      } catch (error) {
        console.error('Failed to fetch mentees:', error);
      }
    };
    fetchMentees();
  }, []);
  
const loadMyFeedback = async () => {
       try {
         const { data } = await axios.get(
           'http://localhost:5001/feedback',
           { withCredentials: true }
         );
         setFeedbackList(data);
         setShowFeedbackList(true);
       } catch (err) {
         console.error(err);
         alert('Could not load feedback.');
       }
     };
const submitFeedback = async () => {
         try {
           await axios.post('http://localhost:5001/feedback', {
             otherId:       selectedMentee.id,   // mentee_id
             score:         feedbackScore,
             comment:       feedbackComment
           }, { withCredentials: true });
           setShowFeedbackModal(false);
           setFeedbackScore(3);
           setFeedbackComment('');
           alert('Feedback submitted!');
         } catch (err) {
           console.error(err);
           alert('Failed to submit feedback.');
         }
       };

  

  return (
    <div>
      <Header />
      <div className="flex p-6 gap-6 items-start">
        
        <div className="flex-[3] bg-white p-4 rounded shadow">
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

        <div className="flex flex-col gap-4 items-end w-80">
          <button
            onClick={() => setShowMenteeModal(true)}
            className="w-full h-28 border border-gray-400 rounded bg-white shadow hover:bg-gray-100 text-sm text-gray-800 p-3 text-left"
          >
            <strong>Mentee Information</strong>
            <br />
            <span className="text-xs">(click here for details)</span>
          </button>
            
          {/* View Feedback button */}
          <button
            onClick={loadMyFeedback}
            className="w-full bg-secondary text-white py-2 rounded hover:bg-primary transition"
          >
            View Feedback
          </button>

          {/* Feedback List */}
          {showFeedbackList && (
            <div className="w-full bg-white p-4 rounded shadow mt-2 max-h-64 overflow-auto">
              <h3 className="text-lg font-bold mb-2">Feedback Received</h3>
              <ul className="space-y-2 text-sm">
                {feedbackList.map((fb, i) => (
                  <li key={i} className="border-b pb-2">
                    <p><strong>From Mentee ID:</strong> {fb.mentee_id}</p>
                    <p><strong>Score:</strong> {fb.feedback_score}</p>
                    <p><strong>Comment:</strong> {fb.comments}</p>
                  </li>
                ))}
                {feedbackList.length === 0 && <li>No feedback yet.</li>}
              </ul>
            </div>
          )}
        </div>
        

          <div className="w-flex[1] bg-white p-4 rounded shadow">
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
        
  
        {showModal && selectedSession && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded shadow-lg max-w-md w-full">
              <h3 className="text-xl font-bold mb-4">Session Details</h3>
              <p><strong>Participants:</strong> {selectedSession.mentor_name}, {selectedSession.mentee_name}</p>
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
  
        {showMenteeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-lg max-w-md w-full max-h-[80vh] overflow-auto relative">
            <button
              onClick={() => {
                setShowMenteeModal(false);
                setSelectedMentee(null);
              }}
              className="absolute top-2 right-2 text-xl font-bold text-red-500 hover:text-red-700"
            >
              ×
            </button>

            <h3 className="text-xl font-bold mb-4">
              {!selectedMentee ? "Select a Mentee" : "Mentee Details"}
            </h3>

            {!selectedMentee ? (
              <div className="space-y-4">
                {assignedMentees.length === 0 ? (
                  <p>No mentees assigned.</p>
                ) : (
                  assignedMentees.map((mentee) => (
                    <div
                      key={mentee.id}
                      onClick={() => setSelectedMentee(mentee)}
                      className="cursor-pointer px-4 py-2 border rounded-lg hover:bg-primary hover:text-black transition"
                    >
                      <p className="text-lg font-medium">{mentee.name}</p>
                      <p className="text-sm text-gray-500">ID: {mentee.id}</p>
                    </div>
                  ))
                )}
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-lg"><span className="font-bold">User ID:</span> {selectedMentee.id}</p>
                <p className="text-lg"><span className="font-bold">Name:</span> {selectedMentee.name}</p>
                <p className="text-lg"><span className="font-bold">Phone:</span> {selectedMentee.phone}</p>
                <p className="text-lg"><span className="font-bold">Email:</span> {selectedMentee.email}</p>
                <p className="text-lg"><span className="font-bold">Goals:</span> {selectedMentee.goals}</p>
                <p className="text-lg"><span className="font-bold">Date Joined:</span> {selectedMentee.dateJoined}</p>
                <p className="text-lg"><span className="font-bold">Skills:</span> {selectedMentee.skills}</p>
                <p className="text-lg"><span className="font-bold">Institution:</span> {selectedMentee.institution}</p>
                <p className="text-lg"><span className="font-bold">Academic Status:</span> {selectedMentee.status}</p>
              </div>
            )}

            <div className="mt-4 text-right space-x-2">
              {selectedMentee && (
                <button
                  onClick={() => setSelectedMentee(null)}
                  className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                >
                  Back
                </button>
              )}
              {selectedMentee && (
             <button
               onClick={() => setShowFeedbackModal(true)}
               className="bg-secondary text-white px-4 py-2 rounded hover:bg-primary"
             >
               Add Feedback
             </button>
           )}
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
            {showFeedbackModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-11/12 max-w-md">
            <h3 className="text-xl font-bold mb-4">Add Feedback</h3>
            <div className="space-y-3">
              <label className="block text-sm">Score (1–5)</label>
              <input
                type="number" min="1" max="5"
                value={feedbackScore}
                onChange={e => setFeedbackScore(e.target.value)}
                className="w-full p-2 border rounded"
              />
              <label className="block text-sm">Comment</label>
              <textarea
                rows="3"
                value={feedbackComment}
                onChange={e => setFeedbackComment(e.target.value)}
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => setShowFeedbackModal(false)}
                className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={submitFeedback}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Submit
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