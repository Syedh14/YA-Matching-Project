import React from 'react';

function AddProgressReportModal({ newReport, setNewReport, onSubmit, onClose, mentees }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">Add Progress Report</h2>

        {/* Dropdown for selecting mentee */}
        <select
          className="w-full mb-2 p-2 border rounded"
          value={newReport.menteeId || ''}
          onChange={(e) =>
            setNewReport({ ...newReport, menteeId: e.target.value })
          }
        >
          <option value="" disabled>Select Mentee</option>
          {mentees.map((mentee) => (
            <option key={mentee.user_id} value={mentee.user_id}>
              {mentee.name}
            </option>
          ))}
        </select>

        <input
          className="w-full mb-2 p-2 border rounded"
          type="text"
          placeholder="Areas of Improvement"
          value={newReport.areasOfImprovement}
          onChange={(e) => setNewReport({ ...newReport, areasOfImprovement: e.target.value })}
        />
        <input
          className="w-full mb-2 p-2 border rounded"
          type="text"
          placeholder="Skills Improved"
          value={newReport.skillsImproved}
          onChange={(e) => setNewReport({ ...newReport, skillsImproved: e.target.value })}
        />
        <input
          className="w-full mb-2 p-2 border rounded"
          type="text"
          placeholder="Challenges"
          value={newReport.challenges}
          onChange={(e) => setNewReport({ ...newReport, challenges: e.target.value })}
        />

        <div className="flex justify-end">
          <button className="bg-gray-400 text-white px-4 py-2 rounded mr-2" onClick={onClose}>
            Cancel
          </button>
          <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={onSubmit}>
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddProgressReportModal;
