import React, { useState } from "react";
import Header from '../components/Header';

const initialMentors = [
  "Temp Mentor Name", 
  "Temp Mentor Name", 
  "Temp Mentor Name", 
  "Temp Mentor Name", 
  "Temp Mentor Name",
  "Temp Mentor Name", 
  "Temp Mentor Name", 
  "Temp Mentor Name", 
  "Temp Mentor Name", 
  "Temp Mentor Name"
];

const initialMentees = [
  "Temp Mentee Name", 
  "Temp Mentee Name", 
  "Temp Mentee Name", 
  "Temp Mentee Name", 
  "Temp Mentee Name",
  "Temp Mentee Name", 
  "Temp Mentee Name", 
  "Temp Mentee Name", 
  "Temp Mentee Name", 
  "Temp Mentee Name"
];


const AdminDashboard = () => {

  const [mentors, setMentors] = useState(initialMentors);
  const [mentees, setMentees] = useState(initialMentees);

  const deleteMentor = (index) => {
    setMentors(mentors.filter((_, i) => i !== index));
  };

  const deleteMentee = (index) => {
    setMentees(mentees.filter((_, i) => i !== index));
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
                <span>{mentor}</span>
                <button
                  onClick={() => deleteMentor(index)}
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
                <span>{mentee}</span>
                <button
                  onClick={() => deleteMentee(index)}
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