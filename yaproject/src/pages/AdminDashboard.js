import React, { useState, useEffect } from "react";
import Header from '../components/Header';
import axios from 'axios';

const AdminDashboard = () => {

  const [mentors, setMentors] = useState([]);
  const [mentees, setMentees] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5001/admin/mentors", { withCredentials: true })
      .then((res) => setMentors(res.data))
      .catch((err) => console.error("Failed to fetch mentors:", err));

    axios.get("http://localhost:5001/admin/mentees", { withCredentials: true })
      .then((res) => setMentees(res.data))
      .catch((err) => console.error("Failed to fetch mentees:", err));
  }, []);

  const deleteMentor = (id) => {
    axios.delete(`http://localhost:5001/admin/mentor/${id}`).then(() => {
      setMentors(prev => prev.filter(m => m.id !== id));
    });
  };

  const deleteMentee = (id) => {
    axios.delete(`http://localhost:5001/admin/mentee/${id}`).then(() => {
      setMentees(prev => prev.filter(m => m.id !== id));
    });
  };

  return (
    <div>
      <Header />
      <div className="p-6 flex flex-col items-center">
      <div className="text-2xl font-semibold mb-8">Mentors & Mentees</div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-12 w-full max-w-5xl">
        <div className="w-full">
          <h2 className="text-lg font-medium mb-4 text-center">MENTORS</h2>
          <div className="bg-gray-200 p-4 rounded-lg shadow-inner max-h-[32rem] overflow-y-auto space-y-4">
            {mentors.map((mentor, index) => (
              <div key={index} className="flex justify-between items-center bg-gray-300 p-3 rounded">
                <span>{mentor.name}</span>
                <button
                  onClick={() => deleteMentor(mentor.id)}
                  className="bg-white text-red-600 border border-red-600 px-4 py-1 rounded hover:bg-red-600 hover:text-white transition"
                >
                  DELETE
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="w-full">
          <h2 className="text-lg font-medium mb-4 text-center">MENTEES</h2>
          <div className="bg-gray-200 p-4 rounded-lg shadow-inner max-h-[32rem] overflow-y-auto space-y-4">
            {mentees.map((mentee, index) => (
              <div key={index} className="flex justify-between items-center bg-gray-300 p-3 rounded">
                <span>{mentee.name}</span>
                <button
                  onClick={() => deleteMentee(mentee.id)}
                  className="bg-white text-red-600 border border-red-600 px-4 py-1 rounded hover:bg-red-600 hover:text-white transition"
                >
                  DELETE
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default AdminDashboard;