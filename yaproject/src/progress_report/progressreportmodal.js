
import React from 'react';

function ProgressReportModal({ report, onClose }) {
  if (!report) return null;

  return (
    <div 
      className="
        fixed inset-0 flex items-center justify-center 
        bg-black bg-opacity-50
      "
    >
      <div className="bg-white p-6 rounded shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">Progress Report Details</h2>

        <p className="text-sm mb-2">
          <strong>Progress report id:</strong> {report.report_id}
        </p>
        <p className="text-sm mb-2">
          <strong>Date:</strong>{' '}
          {report.date_created
            ? new Date(report.date_created).toLocaleString()
            : 'N/A'}
        </p>
        <p className="text-sm mb-2">
          <strong>Areas of improvement:</strong>{' '}
          {report.areas_of_improvement || 'N/A'}
        </p>
        <p className="text-sm mb-2">
          <strong>Skills improved:</strong>{' '}
          {report.skills_improved || 'N/A'}
        </p>
        <p className="text-sm mb-2">
          <strong>Challenges Faced:</strong>{' '}
          {report.challenges || 'N/A'}
        </p>

        <button
          className="mt-4 bg-secondary text-white px-4 py-2 rounded hover:bg-secondary-dark"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
}

export default ProgressReportModal;
