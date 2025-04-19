
// src/pages/Profile.jsx
import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import axios from 'axios';

function Profile() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Fetch profile data from the server using the session (cookie)
    axios.get("http://localhost:5001/auth/profile", { withCredentials: true })
      .then(res => {
        setUser(res.data);  // res.data contains the profile object from the server
      })
      .catch(err => {
        console.error("Failed to fetch profile data", err);
        setUser(null);
      });
  }, []);

  if (!user) return <div>Loading...</div>;

  return (
    <>
      <Header />
      <div className="min-h-screen flex items-center justify-center bg-primary">
        <div className="bg-white shadow-md rounded p-10 max-w-lg w-full">
          {/* Header with an Edit button (if needed) */}
          <div className="flex justify-end mb-6">
            <button className="bg-gray-300 text-black font-bold py-1 px-3 rounded">
              Edit
            </button>
          </div>

          {/* Profile Info Header */}
          <div className="flex flex-col items-center mb-4">
            <div className="w-40 h-40 rounded-full border border-gray-400 mb-4" />
            <h2 className="text-xl font-semibold">
              {user.firstName} {user.lastName}
            </h2>
            <p className="text-sm text-gray-500 capitalize">
              {user.role}
            </p>
          </div>

          {/* Contact Info and Common Fields */}
          <div className="space-y-3 text-left">
            <p className="text-md font-medium">
              📞 Phone(s): {user.phones?.join(', ') || 'N/A'}
            </p>
            <p className="text-md font-medium">
              📧 Email(s): {user.emails?.join(', ') || 'N/A'}
            </p>
            {/* Shared profile attributes */}
            <p className="text-md font-medium">🎯 Goal: {user.goal || 'N/A'}</p>
            <p className="text-md font-medium">🛠 Skill: {user.skill || 'N/A'}</p>

            {/* Role-specific fields */}
            {user.role === 'mentor' && (
              <>
                <p className="text-md font-medium">
                  🎓 Academic Status: {user.mentorAcademicStatus || 'N/A'}
                </p>
                <p className="text-md font-medium">
                  ✅ Active Status: {user.mentorActiveStatus ? 'Active' : 'Inactive'}
                </p>
              </>
            )}
            {user.role === 'mentee' && (
              <>
                <p className="text-md font-medium">
                  🏫 Institution: {user.menteeInstitution || 'N/A'}
                </p>
                <p className="text-md font-medium">
                  🎓 Academic Status: {user.menteeAcademicStatus || 'N/A'}
                </p>
              </>
            )}
            {/* (Admins have no extra fields beyond common info) */}
          </div>

          {/* Contact Button (optional feature) */}
          <div className="mt-6 flex justify-center">
            <button className="bg-gray-300 text-black font-semibold py-2 px-4 rounded">
              Contact Youth Achieve
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Profile;
