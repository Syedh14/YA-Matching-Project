import React, { useState } from "react";
import Header from '../components/Header';

const initialMatches = [
  { id: 1, mentor: "Mentor 1", mentee: "Mentee 1" },
  { id: 2, mentor: "Mentor 1", mentee: "Mentee 2" },
  { id: 3, mentor: "Mentor 1", mentee: "Mentee 3" },
  { id: 4, mentor: "Mentor 2", mentee: "Mentee 4" },
  { id: 5, mentor: "Mentor 1", mentee: "Mentee 1" },
  { id: 6, mentor: "Mentor 1", mentee: "Mentee 2" },
  { id: 7, mentor: "Mentor 1", mentee: "Mentee 3" },
  { id: 8, mentor: "Mentor 2", mentee: "Mentee 4" },
  { id: 9, mentor: "Mentor 1", mentee: "Mentee 1" },
  { id: 10, mentor: "Mentor 1", mentee: "Mentee 2" },
  { id: 11, mentor: "Mentor 1", mentee: "Mentee 3" },
  { id: 12, mentor: "Mentor 2", mentee: "Mentee 4" },
  { id: 13, mentor: "Mentor 1", mentee: "Mentee 1" },
];

const AiMatches = () => {
    const [matches, setMatches] = useState(initialMatches);

  const handleButtonClick = (id, actionType) => {
    setMatches(prev => prev.filter(match => match.id !== id));
  };

  return (
    <div>
        <Header />
        <div className="p-6">
        <h2 className="text-2xl font-semibold mb-10">Potential Matches:</h2>

        <div className="max-h-[46rem] overflow-y-auto space-y-4 pr-2">
            {matches.map(({ id, mentor, mentee }) => (
            <div
                key={id}
                className="flex flex-col md:flex-row md:items-center md:justify-between bg-white border rounded-xl p-4 shadow-sm"
            >
                <p className="text-lg mb-2 md:mb-0">
                <strong className="font-bold text-secondary">{mentor}</strong> Matched With <strong className="font-bold text-secondary">{mentee}</strong>
                </p>
                <div className="flex gap-6">
                    <button onClick={() => handleButtonClick(id, "Approved")} className="bg-secondary text-white font-semibold px-6 py-3 rounded-md hover:bg-primary hover:text-black transition text-lg">
                        Approve
                    </button>
                    <button onClick={() => handleButtonClick(id, "Rejected")} className="bg-secondary text-white font-semibold px-6 py-3 rounded-md hover:bg-primary hover:text-black transition text-lg">
                        Reject
                    </button>
                </div>
            </div>
            ))}
        </div>
        </div>
    </div>
  );
};

export default AiMatches;
