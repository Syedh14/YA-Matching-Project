import React, { useState } from "react";
import Header from '../components/Header';

const initialMatches = [
  { id: 1, mentor: "Mentor 1", mentee: "Mentee 1", successRate: 96, model: "Gemini" },
  { id: 2, mentor: "Mentor 1", mentee: "Mentee 2", successRate: 96, model: "Gemini" },
  { id: 3, mentor: "Mentor 1", mentee: "Mentee 3", successRate: 96, model: "Gemini" },
  { id: 4, mentor: "Mentor 2", mentee: "Mentee 4", successRate: 96, model: "Gemini" },
  { id: 5, mentor: "Mentor 1", mentee: "Mentee 1", successRate: 96, model: "Gemini" },
  { id: 6, mentor: "Mentor 1", mentee: "Mentee 2", successRate: 96, model: "Gemini" },
  { id: 7, mentor: "Mentor 1", mentee: "Mentee 3", successRate: 96, model: "Gemini" },
  { id: 8, mentor: "Mentor 2", mentee: "Mentee 4", successRate: 96, model: "Gemini" },
  { id: 9, mentor: "Mentor 1", mentee: "Mentee 1", successRate: 96, model: "Gemini" },
  { id: 10, mentor: "Mentor 1", mentee: "Mentee 2", successRate: 96, model: "Gemini" },
  { id: 11, mentor: "Mentor 1", mentee: "Mentee 3", successRate: 96, model: "Gemini" },
  { id: 12, mentor: "Mentor 2", mentee: "Mentee 4", successRate: 96, model: "Gemini" },
  { id: 13, mentor: "Mentor 1", mentee: "Mentee 1", successRate: 96, model: "Gemini" },
];

const AiMatches = () => {
    const [matches, setMatches] = useState(initialMatches);
    const [selectedMatch, setSelectedMatch] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = (match) => {
    setSelectedMatch(match);
    setIsModalOpen(true);
    };

    const closeModal = () => {
    setSelectedMatch(null);
    setIsModalOpen(false);
    };

    const handleButtonClick = (id, actionType) => {
        setMatches(prev => prev.filter(match => match.id !== id));
    };

    return (
        <div>
          <Header />
          <div className="p-6">
            <h2 className="text-2xl font-semibold mb-10">Potential Matches:</h2>
      
            <div className="max-h-[46rem] overflow-y-auto space-y-4 pr-2">
              {matches.map((match) => (
                <div
                  key={match.id}
                  className="flex flex-col md:flex-row md:items-center md:justify-between bg-white border rounded-xl p-4 shadow-sm"
                >
                  <button
                    onClick={() => openModal(match)}
                    className="text-lg mb-2 md:mb-0 bg-gray-100 hover:bg-gray-200 text-left p-6 rounded-md transition w-full md:w-auto"
                >
                    <strong className="font-bold text-secondary">{match.mentor}</strong> Matched With{" "}
                    <strong className="font-bold text-secondary">{match.mentee}</strong>
                  </button>
      
                  <div className="flex gap-6">
                    <button
                      onClick={() => handleButtonClick(match.id, "Approved")}
                      className="bg-secondary text-white font-semibold px-6 py-3 rounded-md hover:bg-primary hover:text-black transition text-lg"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleButtonClick(match.id, "Rejected")}
                      className="bg-secondary text-white font-semibold px-6 py-3 rounded-md hover:bg-primary hover:text-black transition text-lg"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
      
          {isModalOpen && selectedMatch && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-lg relative shadow-lg">
                <button
                  onClick={closeModal}
                  className="absolute top-4 right-4 text-red-500 hover:text-secondary text-3xl font-bold transition"
                >
                  &times;
                </button>
      
                <h3 className="text-2xl font-semibold mb-4">Match Details</h3>
                <p className="text-lg">
                  <span className="font-bold">Match ID:</span> {selectedMatch.id}
                </p>
                <p className="text-lg mt-2">
                  <span className="font-bold">Mentor:</span> {selectedMatch.mentor}
                </p>
                <p className="text-lg mt-2">
                  <span className="font-bold">Mentee:</span> {selectedMatch.mentee}
                </p>
                <p className="text-lg mt-2">
                  <span className="font-bold">Success Rate:</span> {selectedMatch.successRate}
                </p>
                <p className="text-lg mt-2">
                  <span className="font-bold">AI Model:</span> {selectedMatch.model}
                </p>
              </div>
            </div>
          )}
        </div>
      );
      
};

export default AiMatches;
