import React, { useState, useEffect } from "react";
import Header from '../components/Header';
import axios from "axios";


const AiMatches = () => {
    const [user, setUser] = useState(null);
    const [matches, setMatches] = useState([]);
    const [selectedMatch, setSelectedMatch] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

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
      axios
        .get("http://localhost:5001/admin/matches", { withCredentials: true })
        .then(res => setMatches(res.data))
        .catch(err => console.error("Failed to fetch matches:", err));
    }, []);


    const openModal = (match) => {
      setSelectedMatch(match);
      setIsModalOpen(true);
    };

    const closeModal = () => {
      setSelectedMatch(null);
      setIsModalOpen(false);
    };

    const handleButtonClick = (id) => {
        setMatches(prev => prev.filter(match => match.id !== id));
    };

    const handleAccept = async (match) => {
      try {
        await axios.post("http://localhost:5001/admin/acceptMatch", {
          match_id: match.id,
          mentor_id: match.mentor_id,
          mentee_id: match.mentee_id,
          admin_id: user.user_id
        }, { withCredentials: true });

        setMatches(prev => prev.filter(m => m.id !== match.id));
    
        alert("Match accepted. Sessions generated.");
      } catch (err) {
        console.error("Accept failed:", err);
        alert("Error accepting match.");
      }
    };
    

    return (
      <div>
        <Header />
        <div className="p-6">
          <h2 className="text-2xl font-semibold mb-10">Potential Matches:</h2>
          <div className="max-h-[46rem] overflow-y-auto space-y-4 pr-2">
            {matches.length === 0 && (
              <p className="text-center text-gray-600">No matches found.</p>
            )}
            {matches.map(match => (
              <div
                key={match.id}
                className="flex flex-col md:flex-row md:items-center md:justify-between bg-white border rounded-xl p-4 shadow-sm"
              >
                <button
                  onClick={() => openModal(match)}
                  className="text-lg mb-2 md:mb-0 bg-gray-100 hover:bg-gray-200 text-left p-6 rounded-md transition w-full md:w-auto"
                >
                  <strong className="font-bold text-secondary">
                    {match.mentor}
                  </strong>{" "}
                  Matched With{" "}
                  <strong className="font-bold text-secondary">
                    {match.mentee}
                  </strong>
                </button>
  
                <div className="flex gap-6">
                  <button
                    onClick={() => handleAccept(match)}
                    className="bg-secondary text-white font-semibold px-6 py-3 rounded-md hover:bg-primary hover:text-black transition text-lg"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleButtonClick(match.id)}
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
                <span className="font-bold">Success Rate:</span>{" "}
                {selectedMatch.successRate}
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
