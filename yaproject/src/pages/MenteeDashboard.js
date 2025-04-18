import React, { useState } from 'react';
import Header from '../components/Header';

const days = ["MON", "TUES", "WED", "THURS", "FRI", "SAT", "SUN"];
const times = [
  "8 am",
  "10 am",
  "12 pm",
  "2 pm",
  "4 pm",
  "6 pm",
  "8 pm"
];

const sessionsList = [
  { day: "MON", time: "12 pm", type: "session", name: "In-Person", length: 2 },
  { day: "MON", time: "4 pm", type: "session", name: "Online", length: 1 },
  { day: "MON", time: "6 pm", type: "session", name: "In-Person", length: 1 },
  { day: "TUES", time: "10 am", type: "possible", name: "Potential Session", length: 1 },
  { day: "TUES", time: "4 pm", type: "session", name: "In-Person", length: 1 },
  { day: "THURS", time: "4 pm", type: "session", name: "In-Person", length: 1 },
  { day: "FRI", time: "10 am", type: "session", name: "Online", length: 3 },
  { day: "SAT", time: "2 pm", type: "session", name: "In-Person", length: 1 },
  { day: "SUN", time: "4 pm", type: "session", name: "Online", length: 1 }
];

  
const MenteeDashboard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [sessions, setSessions] = useState(sessionsList);
  const [newSession, setNewSession] = useState({
    day: "MON",
    time: "8 am",
    type: "session",
    name: "In-Person",
    length: 1,
  });
  

  const getSession = (day, time) =>
  sessions.find((s) => s.day === day && s.time === time);

  const SessionCell = ({ session, editMode, onDelete }) => {
    const baseStyles = "w-full h-16 flex items-center justify-center text-sm font-medium border-x box-border relative";
    if (!session) return <div className={baseStyles} />;
    return (
      <div
        className={`${baseStyles} ${
          session.type === "session"
            ? "bg-secondary text-white border box-border"
            : "bg-primary text-black border box-border"
        }`}
      >
        {editMode && (
          <button
            onClick={() => onDelete(session.day, session.time)}
            className="absolute top-1 right-1 text-xs bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center hover:bg-red-500"
          >
            ×
          </button>
        )}
        {session.name}
      </div>
    );
  };

  const handleModalToggle = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleDeleteSession = (day, time) => {
    setSessions((prev) => prev.filter((s) => !(s.day === day && s.time === time)));
  };

  return (
    <div>
      <Header />
      <div className="p-8 min-h-full">
        <div className="flex flex-col lg:flex-row justify-between items-start gap-8 mt-24">
          <div className="flex-1">
            <div className="grid grid-cols-[100px_repeat(7,minmax(0,1fr))] gap-0 bg-white p-0 rounded-xl border border-gray-300 shadow-lg shadow-primary w-full overflow-hidden">
              <div className="border border-gray-300 box-border bg-gray-100"></div>
              {days.map((day) => (
                <div
                  key={day}
                  className="text-center font-semibold text-lg border border-gray-300 box-border bg-gray-100 py-2"
                >
                  {day}
                </div>
              ))}

              {times.map((time) => (
                <React.Fragment key={time}>
                  <div className="text-sm text-gray-700 font-medium flex items-start justify-center box-border h-16">
                    {time}
                  </div>
                  {days.map((day) => (
                    <SessionCell
                      key={`${day}-${time}`}
                      session={getSession(day, time)}
                      editMode={editMode}
                      onDelete={handleDeleteSession}
                    />
                  ))}
                </React.Fragment>
              ))}
            </div>

            <div className="flex justify-center mt-6 gap-4">
              <button
                onClick={() => setEditMode((prev) => !prev)}
                className="px-6 py-3 text-lg border rounded hover:bg-primary hover:text-black transition bg-secondary text-white w-32"
              >
                {editMode ? "Done" : "Edit"}
              </button>

              <button
                onClick={() => setShowModal(true)}
                className="px-6 py-3 text-lg border rounded hover:bg-primary hover:text-black transition bg-secondary text-white w-40"
              >
                Add Session
              </button>
            </div>
          </div>

          <div onClick={handleModalToggle} className="w-full lg:w-72 h-60 border border-gray-300 rounded-xl flex items-center justify-center text-center text-gray-800 text-xl font-semibold px-4 py-6 bg-white shadow-md shadow-primary cursor-pointer hover:shadow-lg transition">
            Mentor Information<br />
            (Click Here For More Information)
          </div>
        </div>
        {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-8 rounded-lg w-[36rem]">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold">Mentor Information</h2>
              <button
                className="text-xl font-bold text-red-500 hover:text-secondary transition"
                onClick={handleModalToggle}
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
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md relative">
            <button
              className="absolute top-2 right-2 text-gray-600 hover:text-black text-2xl font-bold"
              onClick={() => setShowModal(false)}
            >
              &times;
            </button>

            <h3 className="text-xl font-semibold mb-4">Add New Session</h3>

            <div className="space-y-4">
              <div>
                <label className="block mb-1 font-medium">Day</label>
                <select
                  value={newSession.day}
                  onChange={(e) => setNewSession({ ...newSession, day: e.target.value })}
                  className="w-full border rounded p-2"
                >
                  {["MON", "TUES", "WED", "THURS", "FRI", "SAT", "SUN"].map((day) => (
                    <option key={day} value={day}>{day}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block mb-1 font-medium">Time</label>
                <select
                  value={newSession.time}
                  onChange={(e) => setNewSession({ ...newSession, time: e.target.value })}
                  className="w-full border rounded p-2"
                >
                  {times.map((time) => (
                    <option key={time} value={time}>{time}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block mb-1 font-medium">Type</label>
                <select
                  value={newSession.type}
                  onChange={(e) => setNewSession({ ...newSession, type: e.target.value })}
                  className="w-full border rounded p-2"
                >
                  <option value="session">Confirmed</option>
                  <option value="possible">Possible</option>
                </select>
              </div>

              <div>
                <label className="block mb-1 font-medium">Name</label>
                <select
                  value={newSession.name}
                  onChange={(e) => setNewSession({ ...newSession, name: e.target.value })}
                  className="w-full border rounded p-2"
                >
                  <option value="In-Person">In-Person</option>
                  <option value="Online">Online</option>
                </select>
              </div>

              <div>
                <label className="block mb-1 font-medium">Length (hours)</label>
                <input
                  type="number"
                  value={newSession.length}
                  min={1}
                  max={4}
                  onChange={(e) => setNewSession({ ...newSession, length: parseInt(e.target.value) })}
                  className="w-full border rounded p-2"
                />
              </div>

              <button
                onClick={() => {
                  sessions.push(newSession); // You'll later replace this with a DB call
                  setShowModal(false);
                  setNewSession({ day: "MON", time: "8 am", type: "session", name: "", length: 1 });
                }}
                className="mt-4 w-full bg-secondary text-white py-2 px-4 rounded hover:bg-primary hover:text-black transition"
              >
                Save Session
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