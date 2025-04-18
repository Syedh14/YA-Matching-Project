import React from 'react';

function Profile() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-primary">
      <div className="bg-white shadow-md rounded p-8 max-w-md w-full">
        {/* Header with Edit Button */}
        <div className="flex justify-end mb-6">
          <button className="bg-gray-300 text-black font-bold py-1 px-3 rounded">Edit</button>
        </div>

        {/* Profile Info */}
        <div className="flex flex-col items-center mb-4">
          <div className="w-32 h-32 rounded-full border border-gray-400 mb-2" />
          <h2 className="text-xl font-semibold">Name</h2>
        </div>

        <div className="space-y-3 text-left">
          <p className="text-md font-medium">phone(s):</p>
          <p className="text-md font-medium">email(s):</p>
          <p className="text-md font-medium">attribute:</p>
          <p className="text-md font-medium">attribute:</p>
        </div>

        {/* Contact Button */}
        <div className="mt-6 flex justify-center">
          <button className="bg-gray-300 text-black font-semibold py-2 px-4 rounded">
            contact youth achieve
          </button>
        </div>
      </div>
    </div>
  );
}

export default Profile;